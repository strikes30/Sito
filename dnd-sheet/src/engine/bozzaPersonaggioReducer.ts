import { bozzaIniziale } from "../types/bozzaPersonaggio";
import classiJson from "../data/classi.json";
import type {
  BozzaPersonaggio,
  Caratteristica,
  DistribuzioneBackground,
} from "../types/bozzaPersonaggio";
import type { Classe } from "../types/datiGioco";


const classi = classiJson as Classe[];


export type AzioneBozza =
  | {
      type: "CAMBIA_CAMPO";
      campo:
        | "nome"
        | "taglia"
        | "sottorazzaId"
        | "primaLinguaId"
        | "secondaLinguaId"
        | "caratteristicaPiuDue"
        | "caratteristicaPiuUno";
      valore: string;
    }
  | {
      type: "CAMBIA_COMPETENZA_ABILITA";
      abilitaId: string;
    }
  | {
      type: "CAMBIA_DISTRIBUZIONE";
      valore: DistribuzioneBackground;
    }
  | {
      type: "CAMBIA_CARATTERISTICA";
      caratteristica: Caratteristica;
      valore: number | null;
    }
  | {
      type: "SELEZIONA_RAZZA";
      razzaId: string;
    }
  | {
      type: "SELEZIONA_CLASSE";
      classeId: string;
    }
  | {
      type: "SELEZIONA_BACKGROUND";
      backgroundId: string;
    }
  | {
      type: "CARICA_BOZZA";
      bozza: BozzaPersonaggio;
    }
  | {
      type: "RESET";
    };


export function bozzaPersonaggioReducer(
  stato: BozzaPersonaggio,
  azione: AzioneBozza,
): BozzaPersonaggio {
  console.log("AZIONE BOZZA:", azione.type);


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


    case "SELEZIONA_CLASSE": {
      const classeSelezionata = classi.find(
        (classe) => classe.id === azione.classeId,
      );

      return {
        ...stato,
        classeId: azione.classeId,
        sottoclasseId: "",
        competenzeArmatura:
          classeSelezionata?.competenzeArmatura ?? [],
      };
    }


    case "SELEZIONA_BACKGROUND":
      return {
        ...stato,
        backgroundId: azione.backgroundId,
        distribuzioneBackground: "",
        caratteristicaPiuDue: "",
        caratteristicaPiuUno: "",
      };


    case "CAMBIA_COMPETENZA_ABILITA": {
      const abilitaGiaSelezionata =
        stato.abilitaCompetenti.includes(
          azione.abilitaId,
        );

      return {
        ...stato,
        abilitaCompetenti: abilitaGiaSelezionata
          ? stato.abilitaCompetenti.filter(
            (id) => id !== azione.abilitaId,
          )
          : [
            ...stato.abilitaCompetenti,
            azione.abilitaId,
          ],
      };
    }

    case "CARICA_BOZZA":
      return azione.bozza;


    case "RESET":
      return bozzaIniziale;


    default:
      return stato;
  }
}