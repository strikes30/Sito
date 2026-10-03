import type { Spell } from "../../types/spell";

type DettagliSpellProps = {
  spell: Spell;
};

export default function DettagliSpell({ spell }: DettagliSpellProps) {
  return (
    <details>
      <summary>Dettagli</summary>

      <p>
        <strong>Scuola:</strong> {spell.school}
      </p>

      <p>
        <strong>Lancio:</strong> {spell.actionType}
      </p>

      <p>
        <strong>Gittata:</strong> {spell.range}
      </p>

      <p>
        <strong>Durata:</strong> {spell.duration}
      </p>

      <p>
        <strong>Componenti:</strong> {spell.components.join(", ")}
      </p>

      {spell.material && (
        <p>
          <strong>Materiale:</strong> {spell.material}
        </p>
      )}

      <p>
        <strong>Concentrazione:</strong>{" "}
        {spell.concentration ? "Sì" : "No"}
      </p>

      <p>
        <strong>Rituale:</strong> {spell.ritual ? "Sì" : "No"}
      </p>

      <p>{spell.description}</p>

      {spell.higherLevelSlot && (
        <p>
          <strong>A livello superiore:</strong> {spell.higherLevelSlot}
        </p>
      )}
    </details>
  );
}