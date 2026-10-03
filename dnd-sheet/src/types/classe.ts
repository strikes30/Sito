export type RisorsaClasse = {
  id: string;
  nome: string;
  livelloSblocco: number;
  massimoPerLivello: number[];
  livelloSlotPerLivello?: number[];
  recupero: string[];
};