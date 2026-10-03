import { useState } from "react";
import type { Arma } from "../../types/datiGioco";

type Props = {
  armi: Arma[];
  armaEquipaggiataId: string | null;
  onScegliArma: (armaId: string) => void;
};

export function SezioneArmaEquipaggiata({
  armi,
  armaEquipaggiataId,
  onScegliArma,
}: Props) {
  const [selettoreAperto, setSelettoreAperto] =
    useState(false);

  const armaEquipaggiata = armi.find(
    (arma) => arma.id === armaEquipaggiataId,
  );

  function selezionaArma(armaId: string) {
    onScegliArma(armaId);
    setSelettoreAperto(false);
  }

  return (
    <section>
      <h2>Arma equipaggiata</h2>

      {armaEquipaggiata ? (
        <div>
          <p>
            <strong>{armaEquipaggiata.nome}</strong>
          </p>

          <p>
            Danno: {armaEquipaggiata.danno}{" "}
            {armaEquipaggiata.tipoDanno}
          </p>
        </div>
      ) : (
        <p>Nessuna arma selezionata</p>
      )}

      <button
        type="button"
        onClick={() =>
          setSelettoreAperto((aperto) => !aperto)
        }
      >
        {selettoreAperto
          ? "Chiudi elenco"
          : armaEquipaggiata
            ? "Cambia arma"
            : "Scegli arma"}
      </button>

      {selettoreAperto && (
        <div>
          <h3>Armi utilizzabili</h3>

          {armi.length === 0 ? (
            <p>Nessuna arma disponibile.</p>
          ) : (
            <ul>
              {armi.map((arma) => (
                <li key={arma.id}>
                  <button
                    type="button"
                    onClick={() =>
                      selezionaArma(arma.id)
                    }
                  >
                    {arma.nome} — {arma.danno}{" "}
                    {arma.tipoDanno}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}