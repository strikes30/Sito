import { useState } from "react";
import type { Spell } from "../types/spell";

type UseIncantesimiParametri = {
  spellDisponibili: Spell[];
  massimoTrucchetti: number;
  massimoIncantesimiPreparati: number;
};

export function useIncantesimi({
  spellDisponibili,
  massimoTrucchetti,
  massimoIncantesimiPreparati,
}: UseIncantesimiParametri) {
  const [trucchettiScelti, setTrucchettiScelti] = useState<string[]>([]);
  const [incantesimiScelti, setIncantesimiScelti] = useState<string[]>([]);

  function cambiaTrucchetto(id: string) {
    const trucchettoValido = spellDisponibili.some(
      (spell) => spell.id === id && spell.level === 0
    );

    if (!trucchettoValido) {
      return;
    }

    setTrucchettiScelti((precedenti) => {
      if (precedenti.includes(id)) {
        return precedenti.filter((precedente) => precedente !== id);
      }

      if (precedenti.length >= massimoTrucchetti) {
        return precedenti;
      }

      return [...precedenti, id];
    });
  }

  function cambiaIncantesimo(id: string) {
    const incantesimoValido = spellDisponibili.some(
      (spell) => spell.id === id && spell.level > 0
    );

    if (!incantesimoValido) {
      return;
    }

    setIncantesimiScelti((precedenti) => {
      if (precedenti.includes(id)) {
        return precedenti.filter((precedente) => precedente !== id);
      }

      if (precedenti.length >= massimoIncantesimiPreparati) {
        return precedenti;
      }

      return [...precedenti, id];
    });
  }

  return {
    trucchettiScelti,
    incantesimiScelti,
    cambiaTrucchetto,
    cambiaIncantesimo,
  };
}