// type Abilita = {
//   id: string;
//   nome: string;
// };

type Props = {
  abilitaDisponibili: string[];
  abilitaSelezionate: string[];
  numeroDaScegliere: number;
  onCambia: (abilitaId: string) => void;
};

export function SelettoreCompetenzeAbilita({
  abilitaDisponibili,
  abilitaSelezionate,
  numeroDaScegliere,
  onCambia,
}: Props) {
  return (
    <fieldset>
      <legend>
        Competenze di classe
      </legend>

      <p>
        Selezionate: {abilitaSelezionate.length}/
        {numeroDaScegliere}
      </p>

      {abilitaDisponibili.map((abilitaId) => {
        const selezionata =
          abilitaSelezionate.includes(abilitaId);

        const disabilitata =
          !selezionata &&
          abilitaSelezionate.length >=
            numeroDaScegliere;

        return (
          <label key={abilitaId}>
            <input
              type="checkbox"
              checked={selezionata}
              disabled={disabilitata}
              onChange={() => onCambia(abilitaId)}
            />

            {abilitaId}
          </label>
        );
      })}
    </fieldset>
  );
}