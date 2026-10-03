type UseRisorseClasseParametri = {
  puntiRisorsaSpesi: number;
  onCambiaPuntiRisorsaSpesi: (nuovoValore: number) => void;
};


export function useRisorseClasse({
  puntiRisorsaSpesi,
  onCambiaPuntiRisorsaSpesi,
}: UseRisorseClasseParametri) {
  function cambiaPuntiRisorsaSpesi(nuovoValore: number) {
    onCambiaPuntiRisorsaSpesi(Math.max(0, nuovoValore));
  }


  function recuperaTutteLeRisorse() {
    onCambiaPuntiRisorsaSpesi(0);
  }


  return {
    puntiRisorsaSpesi,
    cambiaPuntiRisorsaSpesi,
    recuperaTutteLeRisorse,
  };
}