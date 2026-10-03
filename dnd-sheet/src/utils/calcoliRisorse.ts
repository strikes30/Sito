export type RisorsaClasse = {
  id: string;
  nome: string;
  livelloSblocco: number;
  massimoPerLivello: number[];
  livelloSlotPerLivello?: number[];
  recupero: string[];
};

export function calcolaPuntiRisorsaMassimi(
  risorsa: RisorsaClasse | undefined,
  livello: number
): number {
  return risorsa?.massimoPerLivello?.[livello - 1] ?? 0;
}

export function calcolaLivelloSlotRisorsa(
  risorsa: RisorsaClasse | undefined,
  livello: number
): number {
  return risorsa?.livelloSlotPerLivello?.[livello - 1] ?? 0;
}