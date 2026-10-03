import { useEffect, useState } from "react";
import type { Spell } from "../types/spell";


type UseIncantesimiParametri = {
  spellDisponibili: Spell[];
  massimoTrucchetti: number;
  massimoIncantesimiPreparati: number;
};

// Hook personalizzato per gestire la selezione di trucchetti e incantesimi
export function useIncantesimi({
  spellDisponibili,
  massimoTrucchetti,
  massimoIncantesimiPreparati,
}: UseIncantesimiParametri) {
  const [trucchettiScelti, setTrucchettiScelti] = useState<string[]>([]);
  const [incantesimiScelti, setIncantesimiScelti] = useState<string[]>([]);

// Aggiorna gli incantesimi scelti quando cambiano gli incantesimi disponibili
  useEffect(() => {
    const idDisponibili = new Set(
      spellDisponibili.map((spell) => spell.id),
    );


    setTrucchettiScelti((precedenti) =>
      precedenti.filter((id) => idDisponibili.has(id)),
    );


    setIncantesimiScelti((precedenti) =>
      precedenti.filter((id) => idDisponibili.has(id)),
    );
  }, [spellDisponibili]);

// Funzione per cambiare lo stato di un trucchetto scelto
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

// Funzione per cambiare lo stato di un incantesimo scelto
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