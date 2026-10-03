import type { Spell } from "../types/spell";


type UseIncantesimiParametri = {
  spellDisponibili: Spell[];
  massimoTrucchetti: number;
  massimoIncantesimiPreparati: number;
  trucchettiScelti: string[];
  incantesimiScelti: string[];
  onCambiaTrucchetti: (nuoviTrucchetti: string[]) => void;
  onCambiaIncantesimi: (nuoviIncantesimi: string[]) => void;
};


export function useIncantesimi({
  spellDisponibili,
  massimoTrucchetti,
  massimoIncantesimiPreparati,
  trucchettiScelti,
  incantesimiScelti,
  onCambiaTrucchetti,
  onCambiaIncantesimi,
}: UseIncantesimiParametri) {
  function cambiaTrucchetto(id: string) {
    const trucchettoValido = spellDisponibili.some(
      (spell) => spell.id === id && spell.level === 0,
    );

    if (!trucchettoValido) {
      return;
    }

    if (trucchettiScelti.includes(id)) {
      onCambiaTrucchetti(
        trucchettiScelti.filter((trucchettoId) => trucchettoId !== id),
      );
      return;
    }

    if (trucchettiScelti.length >= massimoTrucchetti) {
      return;
    }

    onCambiaTrucchetti([...trucchettiScelti, id]);
  }


  function cambiaIncantesimo(id: string) {
    const incantesimoValido = spellDisponibili.some(
      (spell) => spell.id === id && spell.level > 0,
    );

    if (!incantesimoValido) {
      return;
    }

    if (incantesimiScelti.includes(id)) {
      onCambiaIncantesimi(
        incantesimiScelti.filter((incantesimoId) => incantesimoId !== id),
      );
      return;
    }

    if (incantesimiScelti.length >= massimoIncantesimiPreparati) {
      return;
    }

    onCambiaIncantesimi([...incantesimiScelti, id]);
  }


  return {
    trucchettiScelti,
    incantesimiScelti,
    cambiaTrucchetto,
    cambiaIncantesimo,
  };
}