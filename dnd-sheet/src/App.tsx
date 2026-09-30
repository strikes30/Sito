import { useState } from "react";
import classi from "./data/classi.json";
import razze from "./data/razze.json";
import lingue from "./data/lingue.json";

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
  const [taglia, setTaglia] = useState(""); // Taglia del personaggio
  const [personaggioCreato, setPersonaggioCreato] = useState(false);   // Stato per verificare se il personaggio è stato creato
  const [livello, setLivello] = useState(1);  // Livello del personaggio
  const [primaLinguaId, setPrimaLinguaId] = useState("");  // Prima lingua del personaggio
  const [secondaLinguaId, setSecondaLinguaId] = useState("");  // Seconda lingua del personaggio

  // Stato per le caratteristiche del personaggio, inizializzate a null
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

  // Filtra le lingue iniziali, escludendo la lingua "comune" e ordinandole alfabeticamente
  const lingueIniziali = lingue
    .filter((lingua) =>
      lingua.categoria === "standard" && lingua.id !== "comune"
    )
    .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"));

  // Funzione per cambiare il valore di una caratteristica
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

  // Funzione per creare il personaggio, con controlli di validità
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

    // Controlla se le lingue selezionate sono valide e diverse tra loro
    if (
      primaLinguaId === secondaLinguaId ||
      !lingueIniziali.some((lingua) => lingua.id === primaLinguaId) ||
      !lingueIniziali.some((lingua) => lingua.id === secondaLinguaId)
    ) {
      return;
    }

    setPersonaggioCreato(true);
  }

  // Funzione per calcolare il modificatore di una caratteristica
  function modificatore(punteggio: number) {
    return Math.floor((punteggio - 10) / 2);
  }
  // Funzione per il calcolo della vita
  function calcolaPuntiFerita(
    dadoVita: number,
    livello: number,
    modificatoreCostituzione: number,
  ): number {
    const pfPrimoLivello = Math.max(
      1,
      dadoVita + modificatoreCostituzione,
    );

    const valoreFisso = Math.floor(dadoVita / 2) + 1;
    const pfLivelliSuccessivi = Math.max(
      1,
      valoreFisso + modificatoreCostituzione,
    );

    return pfPrimoLivello + (livello - 1) * pfLivelliSuccessivi;
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

          {/* Gruppo per le lingue del personaggio */}
          <h2>Lingue</h2>
          <p>Conosci già: Comune. Scegli altre due lingue standard.</p>

          <div>
            <label htmlFor="prima-lingua">Prima lingua: </label>
            <select
              id="prima-lingua"
              value={primaLinguaId}
              onChange={(evento) => setPrimaLinguaId(evento.target.value)}
              required
            >
              <option value="">Seleziona una lingua</option>

              {lingueIniziali.map((lingua) => (
                <option
                  key={lingua.id}
                  value={lingua.id}
                  disabled={lingua.id === secondaLinguaId}
                >
                  {lingua.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="seconda-lingua">Seconda lingua: </label>
            <select
              id="seconda-lingua"
              value={secondaLinguaId}
              onChange={(evento) => setSecondaLinguaId(evento.target.value)}
              required
            >
              <option value="">Seleziona una lingua</option>

              {lingueIniziali.map((lingua) => (
                <option
                  key={lingua.id}
                  value={lingua.id}
                  disabled={lingua.id === primaLinguaId}
                >
                  {lingua.nome}
                </option>
              ))}
            </select>
          </div>

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

  // Estrae il punteggio di Costituzione dalle caratteristiche del personaggio
  const costituzione = caratteristiche.Costituzione;

  const puntiFeritaMassimi =
    classeSelezionata && costituzione !== null
      ? calcolaPuntiFerita(
        classeSelezionata.dadoVita,
        livello,
        modificatore(costituzione),
      )
      : null;


  /////// RENDERING DEL SITO, visualizzazione personaggio creato ///////
  return (
    <main>
      <h1>Scheda del personaggio</h1>

      {/* Gruppo per livello del personaggio */}
      <p>Livello: {livello}</p>
      <button
        onClick={() => setLivello(livello + 1)}
        disabled={livello >= 20}
      >
        Sali di livello
      </button>

      <h2>{nome}</h2>
      <p>Classe: {classeSelezionata?.nome}</p>
      <p>Dado vita: d{classeSelezionata?.dadoVita}</p>
      <p>Punti ferita massimi: {puntiFeritaMassimi ?? "—"}</p>



      {/* Gruppo per la razza e sottorazza del personaggio */}
      <p>Razza: {razzaSelezionata?.nome}</p>

      {sottorazzaSelezionata && (
        <p>Sottorazza: {sottorazzaSelezionata.nome}</p>
      )}

      <p>Tipo di creatura: {razzaSelezionata?.tipoCreatura}</p>
      <p>Taglia: {taglia}</p>
      <p>Velocità: {razzaSelezionata?.velocita} piedi</p>

      {/* Gruppo per le lingue del personaggio */}
      <h2>Lingue conosciute</h2>
      <ul>
        <li>Comune</li>
        <li>{lingue.find((lingua) => lingua.id === primaLinguaId)?.nome}</li>
        <li>{lingue.find((lingua) => lingua.id === secondaLinguaId)?.nome}</li>
      </ul>

      {/* Gruppo per le caratteristiche del personaggio */}
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