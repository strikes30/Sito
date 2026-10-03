import { bozzaIniziale } from "../types/bozzaPersonaggio";
import type {
  BozzaPersonaggio,
  Caratteristica,
  DistribuzioneBackground,
} from "../types/bozzaPersonaggio";

export type AzioneBozza =
  | {
    type: "CAMBIA_CAMPO";
    campo:
    | "nome"
    | "taglia"
    | "primаLinguaId"
    | "secondaLinguaId"
    | "caratteristicaPiuDue"
    | "caratteristicaPiuUno";
    valore: string;
  }
  | { type: "CAMBIA_DISTRIBUZIONE"; valore: DistribuzioneBackground }
  | {
    type: "CAMBIA_CARATTERISTICA";
    caratteristica: Caratteristica;
    valore: number | null;
  }
  | { type: "SELEZIONA_RAZZA"; razzaId: string }
  | { type: "SELEZIONA_CLASSE"; classeId: string }
  | { type: "SELEZIONA_BACKGROUND"; backgroundId: string }
  | { type: "CARICA_BOZZA"; bozza: BozzaPersonaggio }
  | { type: "RESET" };

export function bozzaPersonaggioReducer(
  stato: BozzaPersonaggio,
  azione: AzioneBozza,
): BozzaPersonaggio {
  switch (azione.type) {
    case "CAMBIA_CAMPO":
      return {
        ...stato,
        [azione.campo]: azione.valore,
      };

    case "CAMBIA_DISTRIBUZIONE":
      return {
        ...stato,
        distribuzioneBackground: azione.valore,
        caratteristicaPiuDue: "",
        caratteristicaPiuUno: "",
      };

    case "CAMBIA_CARATTERISTICA":
      return {
        ...stato,
        caratteristiche: {
          ...stato.caratteristiche,
          [azione.caratteristica]: azione.valore,
        },
      };

    case "SELEZIONA_RAZZA":
      return {
        ...stato,
        razzaId: azione.razzaId,
        sottorazzaId: "",
        taglia: "",
      };

    case "SELEZIONA_CLASSE":
      return {
        ...stato,
        classeId: azione.classeId,
        sottoclasseId: "",
      };

    case "SELEZIONA_BACKGROUND":
      return {
        ...stato,
        backgroundId: azione.backgroundId,
        distribuzioneBackground: "",
        caratteristicaPiuDue: "",
        caratteristicaPiuUno: "",
      };

    case "CARICA_BOZZA":
      return azione.bozza;

    case "RESET":
      return bozzaIniziale;

    default:
      return stato;
  }
}

