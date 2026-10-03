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
  return {
    Forza: caratteristiche.Forza ?? 0,
    Destrezza: caratteristiche.Destrezza ?? 0,
    Costituzione: caratteristiche.Costituzione ?? 0,
    Intelligenza: caratteristiche.Intelligenza ?? 0,
    Saggezza: caratteristiche.Saggezza ?? 0,
    Carisma: caratteristiche.Carisma ?? 0,
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

    abilitaCompetenti: [],

    trucchettiScelti: [],
    incantesimiScelti: [],

    slotConsumati: [],
    puntiRisorsaSpesi: 0,
  };
}