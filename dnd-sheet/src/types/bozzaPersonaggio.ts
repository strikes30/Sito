import type { Caratteristica } from "./personaggio";
import type { CompetenzaArmatura } from "./dnd";

export type { Caratteristica };

export type DistribuzioneBackground = "" | "due" | "tre";

export type CaratteristicheBozza = Record<Caratteristica, number | null>;

// Azioni possibili per il reducer della bozza del personaggio
export type BozzaPersonaggio = {
  nome: string;
  classeId: string;
  sottoclasseId: string;
  razzaId: string;
  sottorazzaId: string;
  taglia: string;
  abilitaCompetenti: string[];
  primaLinguaId: string;
  secondaLinguaId: string;
  backgroundId: string;
  distribuzioneBackground: DistribuzioneBackground;
  caratteristicaPiuDue: string;
  caratteristicaPiuUno: string;
  caratteristiche: CaratteristicheBozza;
  competenzeArmatura: CompetenzaArmatura[];
};

// Azioni possibili per il reducer della bozza del personaggio
export const bozzaIniziale: BozzaPersonaggio = {
  nome: "",
  classeId: "",
  sottoclasseId: "",
  abilitaCompetenti: [],
  razzaId: "",
  sottorazzaId: "",
  taglia: "",
  primaLinguaId: "",
  secondaLinguaId: "",
  backgroundId: "",
  distribuzioneBackground: "",
  caratteristicaPiuDue: "",
  caratteristicaPiuUno: "",
  caratteristiche: {
    Forza: null,
    Destrezza: null,
    Costituzione: null,
    Intelligenza: null,
    Saggezza: null,
    Carisma: null,
  },
  competenzeArmatura: [],
};