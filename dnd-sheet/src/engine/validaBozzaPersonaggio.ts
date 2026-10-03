import type { BozzaPersonaggio } from "../types/bozzaPersonaggio";


type RazzaValidazione = {
  id: string;
  taglie: string[];
  sottorazze: { id: string }[];
};


type SottorazzaValidazione = {
  id: string;
} | undefined;


type LinguaValidazione = {
  id: string;
};


type BackgroundValidazione = {
  id: string;
  caratteristicheDisponibili: string[];
} | undefined;


type DatiValidazione = {
  bozza: BozzaPersonaggio;
  razzaSelezionata: RazzaValidazione | undefined;
  sottorazzaSelezionata: SottorazzaValidazione;
  backgroundSelezionato: BackgroundValidazione;
  lingueIniziali: LinguaValidazione[];
};


export function validaBozzaPersonaggio({
  bozza,
  razzaSelezionata,
  sottorazzaSelezionata,
  backgroundSelezionato,
  lingueIniziali,
}: DatiValidazione): string[] {
  const errori: string[] = [];


  if (bozza.nome.trim() === "") {
    errori.push("Inserisci il nome del personaggio.");
  }


  if (!bozza.classeId) {
    errori.push("Seleziona una classe.");
  }


  if (!razzaSelezionata) {
    errori.push("Seleziona una razza.");
  } else {
    if (!razzaSelezionata.taglie.includes(bozza.taglia)) {
      errori.push("Seleziona una taglia valida per la razza scelta.");
    }


    if (
      razzaSelezionata.sottorazze.length > 0 &&
      !sottorazzaSelezionata
    ) {
      errori.push("Seleziona una sottorazza.");
    }
  }


  if (!bozza.primaLinguaId || !bozza.secondaLinguaId) {
    errori.push("Seleziona entrambe le lingue iniziali.");
  } else if (bozza.primaLinguaId === bozza.secondaLinguaId) {
    errori.push("Le due lingue iniziali devono essere differenti.");
  } else if (
    !lingueIniziali.some(
      (lingua) => lingua.id === bozza.primaLinguaId,
    ) ||
    !lingueIniziali.some(
      (lingua) => lingua.id === bozza.secondaLinguaId,
    )
  ) {
    errori.push(
      "Entrambe le lingue devono essere lingue standard diverse da Comune.",
    );
  }


  if (!backgroundSelezionato) {
    errori.push("Seleziona un background.");
  } else {
    const disponibili =
      backgroundSelezionato.caratteristicheDisponibili;


    if (bozza.distribuzioneBackground === "") {
      errori.push("Seleziona la distribuzione dei bonus del background.");
    } else if (bozza.distribuzioneBackground === "due") {
      if (!disponibili.includes(bozza.caratteristicaPiuDue)) {
        errori.push("Seleziona una caratteristica valida per il bonus +2.");
      }


      if (!disponibili.includes(bozza.caratteristicaPiuUno)) {
        errori.push("Seleziona una caratteristica valida per il bonus +1.");
      }


      if (
        bozza.caratteristicaPiuDue !== "" &&
        bozza.caratteristicaPiuDue === bozza.caratteristicaPiuUno
      ) {
        errori.push(
          "Le caratteristiche del bonus +2 e +1 devono essere differenti.",
        );
      }
    } else if (bozza.distribuzioneBackground === "tre") {
      if (disponibili.length !== 3) {
        errori.push(
          "Il background selezionato non offre esattamente tre aumenti di caratteristica.",
        );
      }
    } else {
      errori.push(
        "Seleziona una distribuzione valida dei bonus del background.",
      );
    }
  }


  const caratteristicheMancanti = Object.entries(
    bozza.caratteristiche,
  )
    .filter(([, valore]) => valore === null)
    .map(([nome]) => nome);


  if (caratteristicheMancanti.length > 0) {
    errori.push(
      `Assegna un valore a: ${caratteristicheMancanti.join(", ")}.`,
    );
  }


  return errori;
}