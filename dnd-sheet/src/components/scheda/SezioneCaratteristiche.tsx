import abilita from "../../data/abilita.json";

import {
  nomiCaratteristiche,
  type Caratteristica,
} from "../../types/personaggio";

type Abilita = {
  id: string;
  nome: string;
  descrizione: string;
  caratteristica: Caratteristica;
};

type SezioneCaratteristicheProps = {
  caratteristiche: Record<Caratteristica, number | null>;
  modificatore: (punteggio: number) => number;
  bonusCompetenza: number;
  tiriSalvezzaCompetenti: string[];

  abilitaClasse: string[];
  abilitaBackground: string[];

  onCambiaCompetenzaAbilita: (id: string) => void;
};

export default function SezioneCaratteristiche({
  caratteristiche,
  modificatore,
  bonusCompetenza,
  tiriSalvezzaCompetenti,
  abilitaClasse,
  abilitaBackground,
  onCambiaCompetenzaAbilita,
}: SezioneCaratteristicheProps) {
  const abilitaTipizzate = abilita as Abilita[];

  return (
    <section>
      <h2>Caratteristiche</h2>

      <ul>
        {nomiCaratteristiche.map((caratteristica) => {
          const punteggio = caratteristiche[caratteristica];

          if (punteggio === null) {
            return null;
          }

          const bonus = modificatore(punteggio);
          const competenteTiroSalvezza =
            tiriSalvezzaCompetenti.includes(caratteristica);

          const bonusTiroSalvezza =
            bonus + (competenteTiroSalvezza ? bonusCompetenza : 0);

          const abilitaDellaCaratteristica = abilitaTipizzate.filter(
            (abilitaSingola) =>
              abilitaSingola.caratteristica === caratteristica
          );

          return (
            <li key={caratteristica}>
              <strong>
                {caratteristica}: {punteggio} (
                {bonus >= 0 ? "+" : ""}
                {bonus})
              </strong>

              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={competenteTiroSalvezza}
                    readOnly
                  />
                  Tiro salvezza:{" "}
                  {bonusTiroSalvezza >= 0 ? "+" : ""}
                  {bonusTiroSalvezza}
                </label>
              </p>

              <ul>
                {abilitaDellaCaratteristica.map((abilitaSingola) => {
                  const competenteDaBackground = abilitaBackground.includes(
                    abilitaSingola.id
                  );

                  const competenteDaClasse =
                    abilitaClasse.includes(abilitaSingola.id);

                  const competente =
                    competenteDaBackground ||
                    competenteDaClasse;

                  const bonusAbilita =
                    bonus + (competente ? bonusCompetenza : 0);

                  return (
                    <li key={abilitaSingola.id}>
                      <label title={abilitaSingola.descrizione}>
                        <input
                          type="checkbox"
                          checked={competente}
                          disabled
                          readOnly
                        />
                        {abilitaSingola.nome}:{" "}
                        {bonusAbilita >= 0 ? "+" : ""}
                        {bonusAbilita}
                        {competenteDaBackground && " (background)"}
                        {competenteDaClasse && " (classe)"}</label>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}