import { useState } from "react";
import classi from "./data/classi.json";
import razze from "./data/razze.json";

const nomiCaratteristiche = [
  "Forza",
  "Destrezza",
  "Costituzione",
  "Intelligenza",
  "Saggezza",
  "Carisma",
] as const;

const valoriStandard = [15, 14, 13, 12, 10, 8]; // Valori standard per le caratteristiche

type Caratteristica = (typeof nomiCaratteristiche)[number];

//////////////////CODICE SITO VISIBILE////////////////////

function App() {
  const [nome, setNome] = useState("");  // Nome del personaggio
  const [classe, setClasse] = useState("");  // Classe del personaggio
  const [razzaId, setRazzaId] = useState("");  // Razza del personaggio
  const [sottorazzaId, setSottorazzaId] = useState("");  // Sottorazza del personaggio
  const [taglia, setTaglia] = useState("");
  const [personaggioCreato, setPersonaggioCreato] = useState(false);   // Stato per verificare se il personaggio è stato creato
  const [livello, setLivello] = useState(1);  // Livello del personaggio

  const [caratteristiche, setCaratteristiche] = useState<
    Record<Caratteristica, number | null>
  >({
    Forza: null,
    Destrezza: null,
    Costituzione: null,
    Intelligenza: null,
    Saggezza: null,
    Carisma: null,
  });

  function cambiaCaratteristica(
    caratteristica: Caratteristica,
    nuovoValore: number | null,
  ) {
    setCaratteristiche((precedenti) => ({
      ...precedenti,
      [caratteristica]: nuovoValore,
    }));
  }

  // Cerca nel JSON la razza che ha l'ID scelto dall'utente
  const razzaSelezionata = razze.find(
    (razza) => razza.id === razzaId,
  );

  const sottorazzaSelezionata = razzaSelezionata?.sottorazze.find(
    (sottorazza) => sottorazza.id === sottorazzaId,
  );

  function creaPersonaggio(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();

    // Controlla se il nome del personaggio è vuoto o contiene solo spazi
    if (nome.trim() === "") return;
    setNome(nome.trim());

    // Controlla se tutte le caratteristiche sono state selezionate
    if (
      nomiCaratteristiche.some(
        (caratteristica) => caratteristiche[caratteristica] === null,
      )
    ) {
      return;
    }

    // Controlla se la razza selezionata è valida e se la taglia è inclusa nelle taglie della razza
    if (!razzaSelezionata) return;
    if (!razzaSelezionata.taglie.includes(taglia)) return;
    if (
      razzaSelezionata.sottorazze.length > 0 &&
      !sottorazzaSelezionata
    ) {
      return;
    }

    setPersonaggioCreato(true);
  }

  function modificatore(punteggio: number) {
    return Math.floor((punteggio - 10) / 2);
  }

  /////// RENDERING DEL SITO, Creazione personaggi qua ///////
  if (!personaggioCreato) {
    return (
      <main>
        <h1>Crea il personaggio</h1>

        {/* Gruppo per il nome del personaggio */}
        <form onSubmit={creaPersonaggio}>
          <div>
            <label htmlFor="nome">Nome: </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>

          {/* Gruppo per la classe del personaggio */}
          <div>
            <label htmlFor="classe">Classe: </label>
            <select
              id="classe"
              value={classe}
              onChange={(evento) => setClasse(evento.target.value)}
              required
            >
              <option value="">Seleziona una classe</option>

              {classi
                .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"))
                .map((voce) => (
                  <option key={voce.id} value={voce.id}>
                    {voce.nome}
                  </option>
                ))}
            </select>
          </div>

          {/* Gruppo per la razza e sottorazza del personaggio */}
          <div>
            <label htmlFor="razza">Razza: </label>

            <select
              id="razza"
              value={razzaId}
              onChange={(evento) => {
                const nuovoId = evento.target.value;
                const nuovaRazza = razze.find((razza) => razza.id === nuovoId);

                setRazzaId(nuovoId);
                setSottorazzaId("");

                setTaglia(
                  nuovaRazza?.taglie.length === 1
                    ? nuovaRazza.taglie[0]
                    : "",
                );
              }}
              required
            >
              <option value="">Seleziona una razza</option>

              {razze
                .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"))
                .map((razza) => (
                  <option key={razza.id} value={razza.id}>
                    {razza.nome}
                  </option>
                ))}
            </select>
          </div>

          {razzaSelezionata && razzaSelezionata.sottorazze.length > 0 && (
            <div>
              <label htmlFor="sottorazza">Sottorazza: </label>

              <select
                id="sottorazza"
                value={sottorazzaId}
                onChange={(evento) => setSottorazzaId(evento.target.value)}
                required
              >
                <option value="">Seleziona una sottorazza</option>

                {razzaSelezionata.sottorazze.map((sottorazza) => (
                  <option key={sottorazza.id} value={sottorazza.id}>
                    {sottorazza.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {razzaSelezionata && (
            <div>
              <label htmlFor="taglia">Taglia: </label>

              {razzaSelezionata.taglie.length === 1 ? (
                <span>{razzaSelezionata.taglie[0]}</span>
              ) : (
                <select
                  id="taglia"
                  value={taglia}
                  onChange={(evento) => setTaglia(evento.target.value)}
                  required
                >
                  <option value="">Seleziona una taglia</option>

                  {razzaSelezionata.taglie.map((opzione) => (
                    <option key={opzione} value={opzione}>
                      {opzione}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Gruppo per le caratteristiche del personaggio */}
          <h2>Caratteristiche</h2>

          {nomiCaratteristiche.map((caratteristica) => (
            <div key={caratteristica}>
              <label htmlFor={caratteristica}>
                {caratteristica}:{" "}
              </label>

              <select
                id={caratteristica}
                value={caratteristiche[caratteristica] ?? ""}
                onChange={(evento) =>
                  cambiaCaratteristica(
                    caratteristica,
                    evento.target.value === ""
                      ? null
                      : Number(evento.target.value),
                  )
                }
                required
              >
                <option value="">Seleziona un valore</option>

                {valoriStandard.map((valore) => {
                  const usatoDaUnAltraCaratteristica =
                    nomiCaratteristiche.some(
                      (altra) =>
                        altra !== caratteristica &&
                        caratteristiche[altra] === valore,
                    );

                  return (
                    <option
                      key={valore}
                      value={valore}
                      disabled={usatoDaUnAltraCaratteristica}
                    >
                      {valore}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          <button type="submit">Crea personaggio</button>
        </form>
      </main>
    );
  }

  // Cerca nel JSON la classe che ha l'ID scelto dall'utente
  const classeSelezionata = classi.find(
    (voce) => voce.id === classe
  );


  /////// RENDERING DEL SITO, visualizzazione personaggio creato ///////
  return (
    <main>
      <h1>Scheda del personaggio</h1>
      <h2>{nome}</h2>
      <p>Classe: {classeSelezionata?.nome}</p>

      <p>Livello: {livello}</p>
      <button
        onClick={() => setLivello(livello + 1)}
        disabled={livello >= 20}
      >
        Sali di livello
      </button>

      <p>Razza: {razzaSelezionata?.nome}</p>

      {sottorazzaSelezionata && (
        <p>Sottorazza: {sottorazzaSelezionata.nome}</p>
      )}

      <p>Tipo di creatura: {razzaSelezionata?.tipoCreatura}</p>
      <p>Taglia: {taglia}</p>
      <p>Velocità: {razzaSelezionata?.velocita} piedi</p>

      <h2>Caratteristiche</h2>
      <ul>
        {nomiCaratteristiche.map((caratteristica) => {
          const punteggio = caratteristiche[caratteristica];
          if (punteggio === null) return null;
          const bonus = modificatore(punteggio);

          return (
            <li key={caratteristica}>
              {caratteristica}: {punteggio} (
              {bonus >= 0 ? "+" : ""}
              {bonus})
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default App;