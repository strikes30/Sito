import type { CompetenzaArmatura } from "./dnd";

export const nomiCaratteristiche = [
  "Forza",
  "Destrezza",
  "Costituzione",
  "Intelligenza",
  "Saggezza",
  "Carisma",
] as const;

export type Caratteristica = (typeof nomiCaratteristiche)[number];

export type CaratteristicheFinali = Record<Caratteristica, number>;

export type Personaggio = {
  id: string;

  nome: string;
  livello: number;

  classeId: string;
  sottoclasseId: string;

  razzaId: string;
  sottorazzaId: string;
  taglia: string;

  lingue: string[];

  backgroundId: string;

  caratteristiche: CaratteristicheFinali;

  abilitaCompetenti: string[];

  trucchettiScelti: string[];
  incantesimiScelti: string[];

  slotConsumati: string[];
  puntiRisorsaSpesi: number;

  competenzeArmatura: CompetenzaArmatura[];
};