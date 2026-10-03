import {
  calcolaBonusCompetenza,
  calcolaClasseArmatura,
  calcolaPuntiFerita,
  modificatore,
} from "./calcoliPersonaggio";
import type { Caratteristica } from "../types/personaggio";

type ClasseBase = {
  dadoVita: number;
};

type CaratteristicheFinali = Record<Caratteristica, number | null>;

export type StatisticheDerivate = {
  costituzione: number | null;
  puntiFeritaMassimi: number | null;
  classeArmatura: number | null;
  bonusCompetenza: number;
};

export function calcolaStatisticheDerivate({
  caratteristicheFinali,
  classe,
  livello,
}: {
  caratteristicheFinali: CaratteristicheFinali;
  classe: ClasseBase | undefined;
  livello: number;
}): StatisticheDerivate {
  const costituzione = caratteristicheFinali.Costituzione;
  const destrezza = caratteristicheFinali.Destrezza;

  const puntiFeritaMassimi =
    classe && costituzione !== null
      ? calcolaPuntiFerita(
          classe.dadoVita,
          livello,
          modificatore(costituzione),
        )
      : null;

  const classeArmatura =
    destrezza !== null ? calcolaClasseArmatura(destrezza) : null;

  return {
    costituzione,
    puntiFeritaMassimi,
    classeArmatura,
    bonusCompetenza: calcolaBonusCompetenza(livello),
  };
}