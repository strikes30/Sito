import { useState } from "react";
import type { Spell } from "../../types/spell";
import DettagliSpell from "./DettagliSpell";

type SezioneIncantesimiProps = {
  spellDisponibili: Spell[];
  trucchettiScelti: string[];
  incantesimiScelti: string[];
  massimoTrucchetti: number;
  massimoIncantesimiPreparati: number;
  onCambiaTrucchetto: (id: string) => void;
  onCambiaIncantesimo: (id: string) => void;
};

export default function SezioneIncantesimi({
  spellDisponibili,
  trucchettiScelti,
  incantesimiScelti,
  massimoTrucchetti,
  massimoIncantesimiPreparati,
  onCambiaTrucchetto,
  onCambiaIncantesimo,
}: SezioneIncantesimiProps) {
  const [nascondiTrucchettiNonScelti, setNascondiTrucchettiNonScelti] =
    useState(false);

  const [nascondiIncantesimiNonScelti, setNascondiIncantesimiNonScelti] =
    useState(false);

  const trucchettiVisibili = spellDisponibili
    .filter(
      (spell) =>
        spell.level === 0 &&
        (!nascondiTrucchettiNonScelti ||
          trucchettiScelti.includes(spell.id))
    )
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const incantesimiVisibili = spellDisponibili
    .filter(
      (spell) =>
        spell.level > 0 &&
        (!nascondiIncantesimiNonScelti ||
          incantesimiScelti.includes(spell.id))
    )
    .sort(
      (a, b) =>
        a.level - b.level || a.name.localeCompare(b.name, "en")
    );

  return (
    <section>
      <h2>Incantesimi</h2>

      <h3>
        Trucchetti ({trucchettiScelti.length}/{massimoTrucchetti})
      </h3>

      <button
        type="button"
        onClick={() =>
          setNascondiTrucchettiNonScelti((precedente) => !precedente)
        }
      >
        {nascondiTrucchettiNonScelti
          ? "Mostra tutti i trucchetti"
          : "Nascondi trucchetti non conosciuti"}
      </button>

      {trucchettiVisibili.map((spell) => (
        <div key={spell.id}>
          <label>
            <input
              type="checkbox"
              checked={trucchettiScelti.includes(spell.id)}
              onChange={() => onCambiaTrucchetto(spell.id)}
            />
            {spell.name}
          </label>

          <DettagliSpell spell={spell} />
        </div>
      ))}

      <h3>
        Incantesimi ({incantesimiScelti.length}/
        {massimoIncantesimiPreparati})
      </h3>

      <button
        type="button"
        onClick={() =>
          setNascondiIncantesimiNonScelti((precedente) => !precedente)
        }
      >
        {nascondiIncantesimiNonScelti
          ? "Mostra tutti gli incantesimi"
          : "Nascondi incantesimi non conosciuti"}
      </button>

      {incantesimiVisibili.map((spell) => (
        <div key={spell.id}>
          <label>
            <input
              type="checkbox"
              checked={incantesimiScelti.includes(spell.id)}
              onChange={() => onCambiaIncantesimo(spell.id)}
            />
            Livello {spell.level}: {spell.name}
          </label>

          <DettagliSpell spell={spell} />
        </div>
      ))}
    </section>
  );
}