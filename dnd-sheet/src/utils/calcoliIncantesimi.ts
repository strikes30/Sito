import type { Spell } from "../types/spell";

export function calcolaLivelloMassimoIncantesimo(
    classeId: string | undefined,
    slotMassimi: number[],
    livelloSlotPatto?: number
): number {
    if (classeId === "warlock") {
        return livelloSlotPatto ?? 0;
    }

    return slotMassimi.reduce(
        (massimo, quantita, indice) =>
            quantita > 0 ? indice + 1 : massimo,
        0
    );
}

export function filtraSpellDisponibili(
    spells: Spell[],
    listaIncantesimi: string,
    massimoTrucchetti: number,
    livelloMassimoSpell: number
): Spell[] {
    return spells.filter(
        (spell) =>
            spell.classes.includes(listaIncantesimi) &&
            (spell.level === 0
                ? massimoTrucchetti > 0
                : spell.level <= livelloMassimoSpell)
    );
}