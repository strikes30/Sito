// Funzione per calcolare il modificatore di una caratteristica
export function modificatore(punteggio: number) {
    return Math.floor((punteggio - 10) / 2);
}

// Funzione per calcolare il bonus di competenza in base al livello del personaggio
export function calcolaBonusCompetenza(livello: number): number {
    return 2 + Math.floor((livello - 1) / 4);
}

// Funzione per il calcolo della vita
export function calcolaPuntiFerita(
    dadoVita: number,
    livello: number,
    modificatoreCostituzione: number,
): number {
    const pfPrimoLivello = Math.max(
        1,
        dadoVita + modificatoreCostituzione,
    );

    const valoreFisso = Math.floor(dadoVita / 2) + 1;
    const pfLivelliSuccessivi = Math.max(
        1,
        valoreFisso + modificatoreCostituzione,
    );

    return pfPrimoLivello + (livello - 1) * pfLivelliSuccessivi;
}