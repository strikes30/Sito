import type { Caratteristica } from "./personaggio";
import type { CompetenzaArmatura } from "./dnd";

export type ProgressioneSlot = "completa" | "metà" | "terzo" | "";

export type Classe = {
  id: string;
  nome: string;
  dadoVita: number;
  progressioneSlot: ProgressioneSlot;
  tiriSalvezza: string[];
  risorsaClasse?: RisorsaClasse;
  competenzeArmatura: CompetenzaArmatura[];
};

export type RisorsaClasse = {
  id: string;
  nome: string;
  livelloSblocco: number;
  massimoPerLivello: number[];
  recupero: string;
  livelloSlotPerLivello?: number[];
};

export type Sottorazza = {
  id: string;
  nome: string;
};

export type Razza = {
  id: string;
  nome: string;
  tipoCreatura: string;
  velocita: number;
  taglie: string[];
  sottorazze: Sottorazza[];
};

export type CategoriaLingua =
  | "standard"
  | "esotica"
  | "speciale";

export type Lingua = {
  id: string;
  nome: string;
  categoria: CategoriaLingua;
};

export type Background = {
  id: string;
  nome: string;
  descrizione: string;
  caratteristicheDisponibili: Caratteristica[];
  abilita: string[];
  competenzaStrumento: string;
  talentoOrigine: string;
  equipaggiamento: unknown[];
};

export type Sottoclasse = {
  id: string;
  nome: string;
  classeId: string;
  progressioneSlot?: ProgressioneSlot;
};