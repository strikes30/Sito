import { useMemo } from "react";

import type { Personaggio } from "../types/personaggio";

import type {
  Arma,
  Background,
  Classe,
  Razza,
  Sottoclasse,
} from "../types/datiGioco";

import { personaggioÈCompetenteConArma } from "../utils/competenzeArmi";
import { calcolaStatisticheDerivate } from "../utils/calcolaStatisticheDerivate";

type Props = {
  personaggio: Personaggio | null;
  classi: Classe[];
  razze: Razza[];
  backgrounds: Background[];
  sottoclassi: Sottoclasse[];
  armi: Arma[];
};

export function useDatiPersonaggio({
  personaggio,
  classi,
  razze,
  backgrounds,
  sottoclassi,
  armi,
}: Props) {
  return useMemo(() => {
    if (!personaggio) {
      return {
        classe: undefined,
        razza: undefined,
        sottorazza: undefined,
        background: undefined,
        sottoclassiDisponibili: [],
        sottoclasse: undefined,
        armiCompetenti: [],
        statistiche: null,
      };
    }

    const classe = classi.find(
      (voce) => voce.id === personaggio.classeId,
    );

    const razza = razze.find(
      (voce) => voce.id === personaggio.razzaId,
    );

    const sottorazza = razza?.sottorazze.find(
      (voce) => voce.id === personaggio.sottorazzaId,
    );

    const background = backgrounds.find(
      (voce) => voce.id === personaggio.backgroundId,
    );

    const sottoclassiDisponibili = sottoclassi.filter(
      (voce) => voce.classeId === personaggio.classeId,
    );

    const sottoclasse = sottoclassiDisponibili.find(
      (voce) => voce.id === personaggio.sottoclasseId,
    );

    const armiCompetenti = classe
      ? armi.filter((arma) =>
          personaggioÈCompetenteConArma(
            arma,
            classe.competenzeArma,
          ),
        )
      : [];

    const statistiche = calcolaStatisticheDerivate({
      caratteristicheFinali: personaggio.caratteristiche,
      classe,
      livello: personaggio.livello,
    });

    return {
      classe,
      razza,
      sottorazza,
      background,
      sottoclassiDisponibili,
      sottoclasse,
      armiCompetenti,
      statistiche,
    };
  }, [
    personaggio,
    classi,
    razze,
    backgrounds,
    sottoclassi,
    armi,
  ]);
}