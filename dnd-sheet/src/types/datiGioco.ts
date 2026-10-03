import type { Caratteristica } from "./personaggio";
import type { CompetenzaArmatura } from "./dnd";

export type ProgressioneSlot = "completa" | "metà" | "terzo" | "patto" | "nessuna";

export type TipoRecupero =
  | "riposo-breve"
  | "riposo-lungo";

export type SceltaCompetenzeAbilita = {
  numero: number;
  scelte: string[];
};

export type Classe = {
  id: string;
  nome: string;
  competenzeAbilita: SceltaCompetenzeAbilita;
  dadoVita: number;
  progressioneSlot: ProgressioneSlot;
  tiriSalvezza: string[];
  risorsaClasse?: RisorsaClasse;
  recupero: TipoRecupero[];
  competenzeArmatura: CompetenzaArmatura[];
  competenzeArma: CompetenzeArma;
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

export type TipoArma =
  | "mischia"
  | "distanza";


export type CategoriaArma =
  | "semplici"
  | "marziali";


export type TipoDanno =
  | "tagliente"
  | "perforante"
  | "contundente";


export type ProprietaArma =
  | "accurata"
  | "lancio"
  | "leggera"
  | "versatile"
  | "due-mani";


export type PadronanzaArma =
  | "vessazione"
  | "rovesciamento"
  | "graffio"
  | "lentezza"
  | "prosciugamento"
  | "spinta"
  | "doppio-fendente"
  | "colpo-di-striscio";


export type RegolaCompetenzaArma = {
  categoria: CategoriaArma;
  proprieta: ProprietaArma[];
};


export type CompetenzeArma = {
  categorie: CategoriaArma[];
  categorieConProprieta: RegolaCompetenzaArma[];
};


export type Arma = {
  id: string;
  nome: string;
  categoria: CategoriaArma;
  tipo: TipoArma;
  danno: string;
  tipoDanno: TipoDanno;
  proprieta: ProprietaArma[];
  dannoVersatile?: string;
  gittata?: {
    normale: number;
    lunga: number;
  };
  padronanza: PadronanzaArma;
  peso: number;
  unitaPeso: "kg";
  costo: number;
  unitaCosto: "mo" | "ma" | "mr";
};