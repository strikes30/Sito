import type { Arma } from "../../types/datiGioco";

type Props = {
  armi: Arma[];
  armaSelezionataId: string | null;
  onSeleziona: (armaId: string) => void;
  onChiudi: () => void;
};

export function SelettoreArma({
  armi,
  armaSelezionataId,
  onSeleziona,
  onChiudi,
}: Props) {
  return (
    <section>
      <h2>Scegli un’arma</h2>

      <button
        type="button"
        onClick={onChiudi}
      >
        Annulla
      </button>

      <ul>
        {armi.map((arma) => (
          <li key={arma.id}>
            <button
              type="button"
              onClick={() => onSeleziona(arma.id)}
              aria-pressed={
                arma.id === armaSelezionataId
              }
            >
              {arma.nome} — {arma.danno}{" "}
              {arma.tipoDanno}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}