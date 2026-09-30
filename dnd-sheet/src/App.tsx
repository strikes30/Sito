import { useState } from "react";
import CreaPersonaggio from "./components/CreaPersonaggio";
import SchedaPersonaggio from "./components/SchedaPersonaggio";

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

  // Funzione per calcolare il bonus di competenza in base al livello del personaggio
  function calcolaBonusCompetenza(livello: number): number {
    return 2 + Math.floor((livello - 1) / 4);
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
    <CreaPersonaggio
      nome={nome}
      setNome={setNome}
      classe={classe}
      setClasse={setClasse}
      razzaId={razzaId}
      setRazzaId={setRazzaId}
      sottorazzaId={sottorazzaId}
      setSottorazzaId={setSottorazzaId}
      taglia={taglia}
      setTaglia={setTaglia}
      primaLinguaId={primaLinguaId}
      setPrimaLinguaId={setPrimaLinguaId}
      secondaLinguaId={secondaLinguaId}
      setSecondaLinguaId={setSecondaLinguaId}
      caratteristiche={caratteristiche}
      cambiaCaratteristica={cambiaCaratteristica}
      creaPersonaggio={creaPersonaggio}
    />
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
  <SchedaPersonaggio
    nome={nome}
    livello={livello}
    onSaliDiLivello={() => setLivello((precedente) => precedente + 1)}
    bonusCompetenza={calcolaBonusCompetenza(livello)}
    nomeClasse={classeSelezionata?.nome}
    dadoVita={classeSelezionata?.dadoVita}
    puntiFeritaMassimi={puntiFeritaMassimi}
    nomeRazza={razzaSelezionata?.nome}
    nomeSottorazza={sottorazzaSelezionata?.nome}
    tipoCreatura={razzaSelezionata?.tipoCreatura}
    taglia={taglia}
    velocita={razzaSelezionata?.velocita}
    primaLinguaId={primaLinguaId}
    secondaLinguaId={secondaLinguaId}
    caratteristiche={caratteristiche}
    modificatore={modificatore}
  />
);
}

export default App;