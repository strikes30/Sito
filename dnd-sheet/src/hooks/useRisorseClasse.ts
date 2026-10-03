import { useState } from "react";

export function useRisorseClasse() {
  const [puntiRisorsaSpesi, setPuntiRisorsaSpesi] = useState(0);

  function cambiaPuntiRisorsaSpesi(nuovoValore: number) {
    setPuntiRisorsaSpesi(Math.max(0, nuovoValore));
  }

  function recuperaTutteLeRisorse() {
    setPuntiRisorsaSpesi(0);
  }

  return {
    puntiRisorsaSpesi,
    cambiaPuntiRisorsaSpesi,
    recuperaTutteLeRisorse,
  };
}