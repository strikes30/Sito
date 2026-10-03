import type {
  Arma,
  CompetenzeArma,
} from "../types/datiGioco";


export function personaggioÈCompetenteConArma(
  arma: Arma,
  competenze: CompetenzeArma,
): boolean {
  if (competenze.categorie.includes(arma.categoria)) {
    return true;
  }


  return competenze.categorieConProprieta.some(
    (regola) =>
      regola.categoria === arma.categoria &&
      regola.proprieta.some((proprieta) =>
        arma.proprieta.includes(proprieta),
      ),
  );
}