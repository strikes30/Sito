import type { BozzaPersonaggio } from "../types/bozzaPersonaggio";

import type {
  Caratteristica,
  Personaggio,
} from "../types/personaggio";

type CaratteristicheConPossibiliNull = Record<
  Caratteristica,
  number | null
>;

function rimuoviNullDalleCaratteristiche(
  caratteristiche: CaratteristicheConPossibiliNull,
): Record<Caratteristica, number> {
  const richiediValore = (
    nome: Caratteristica,
  ): number => {
    const valore = caratteristiche[nome];

    if (valore === null) {
      throw new Error(
        `Impossibile creare il personaggio: manca il valore di ${nome}.`,
      );
    }

    return valore;
  };

  return {
    Forza: richiediValore("Forza"),
    Destrezza: richiediValore("Destrezza"),
    Costituzione: richiediValore("Costituzione"),
    Intelligenza: richiediValore("Intelligenza"),
    Saggezza: richiediValore("Saggezza"),
    Carisma: richiediValore("Carisma"),
  };
}

export function costruisciPersonaggio(
  bozza: BozzaPersonaggio,
  caratteristicheFinali: CaratteristicheConPossibiliNull,
): Personaggio {
  return {
    id: crypto.randomUUID(),

    nome: bozza.nome.trim(),
    livello: 1,

    classeId: bozza.classeId,
    sottoclasseId: bozza.sottoclasseId,
    competenzeArmatura: bozza.competenzeArmatura,

    razzaId: bozza.razzaId,
    sottorazzaId: bozza.sottorazzaId,
    taglia: bozza.taglia,

    lingue: [
      "comune",
      bozza.primaLinguaId,
      bozza.secondaLinguaId,
    ],

    backgroundId: bozza.backgroundId,

    caratteristiche: rimuoviNullDalleCaratteristiche(
      caratteristicheFinali,
    ),

    abilitaCompetenti: bozza.abilitaCompetenti,

    trucchettiScelti: [],
    incantesimiScelti: [],

    slotConsumati: [],
    puntiRisorsaSpesi: 0,

    armaEquipaggiataId: null,
  };
}