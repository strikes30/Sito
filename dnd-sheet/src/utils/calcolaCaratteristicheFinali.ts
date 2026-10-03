import type {
  Caratteristica,
} from "../types/personaggio";
import type {
  DistribuzioneBackground,
} from "../types/bozzaPersonaggio";

type CaratteristicheBase = Record<Caratteristica, number | null>;

import type { Background } from "../types/datiGioco";

export function calcolaCaratteristicheFinali(
  caratteristicheBase: Record<Caratteristica, number | null>,
  background: Background | undefined,
  distribuzione: DistribuzioneBackground,
  caratteristicaPiuDue: string,
  caratteristicaPiuUno: string,
): Record<Caratteristica, number | null> {
  const caratteristicheFinali: CaratteristicheBase = {
    ...caratteristicheBase,
  };

  if (!background) {
    return caratteristicheFinali;
  }

  for (const caratteristica of Object.keys(
    caratteristicheFinali,
  ) as Caratteristica[]) {
    const punteggioIniziale = caratteristicheBase[caratteristica];

    if (punteggioIniziale === null) {
      continue;
    }

    const disponibile =
      background.caratteristicheDisponibili.includes(caratteristica);

    if (!disponibile) {
      continue;
    }

    let aumento = 0;

    if (distribuzione === "tre") {
      aumento = 1;
    }

    if (distribuzione === "due") {
      if (caratteristica === caratteristicaPiuDue) {
        aumento = 2;
      }

      if (caratteristica === caratteristicaPiuUno) {
        aumento = 1;
      }
    }

    caratteristicheFinali[caratteristica] = punteggioIniziale + aumento;
  }

  return caratteristicheFinali;
}