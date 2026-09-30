import lingue from "../data/lingue.json";
import abilita from "../data/abilita.json";

import {
    nomiCaratteristiche,
    type Caratteristica,
} from "../types/personaggio";

type Props = {
    nome: string;
    livello: number;
    onSaliDiLivello: () => void;
    bonusCompetenza: number;

    nomeClasse: string | undefined;
    dadoVita: number | undefined;
    puntiFeritaMassimi: number | null;

    nomeRazza: string | undefined;
    nomeSottorazza: string | undefined;
    tipoCreatura: string | undefined;
    taglia: string;
    velocita: number | undefined;

    primaLinguaId: string;
    secondaLinguaId: string;

    caratteristiche: Record<Caratteristica, number | null>;
    modificatore: (punteggio: number) => number;

    classeArmatura: number | null;

    abilitaCompetenti: string[];
    onCambiaCompetenzaAbilita: (id: string) => void;
};

function SchedaPersonaggio({
    nome,
    livello,
    onSaliDiLivello,
    bonusCompetenza,
    nomeClasse,
    dadoVita,
    puntiFeritaMassimi,
    nomeRazza,
    nomeSottorazza,
    tipoCreatura,
    taglia,
    velocita,
    primaLinguaId,
    secondaLinguaId,
    caratteristiche,
    modificatore,
    classeArmatura,
    abilitaCompetenti,
    onCambiaCompetenzaAbilita,
}: Props) {
    return (
        <main>
            <h1>Scheda del personaggio</h1>

            <p>Livello: {livello}</p>
            <button
                type="button"
                onClick={onSaliDiLivello}
                disabled={livello >= 20}
            >
                Sali di livello
            </button>
            <p>Bonus di competenza: +{bonusCompetenza}</p>

            <h2>{nome}</h2>
            <p>Classe: {nomeClasse}</p>
            <p>Dado vita: {dadoVita === undefined ? "—" : `d${dadoVita}`}</p>
            <p>Punti ferita massimi: {puntiFeritaMassimi ?? "—"}</p>
            <p>Classe armatura: {classeArmatura ?? "—"}</p>
            <p>Razza: {nomeRazza}</p>

            {nomeSottorazza && (
                <p>Sottorazza: {nomeSottorazza}</p>
            )}

            <p>Tipo di creatura: {tipoCreatura}</p>
            <p>Taglia: {taglia}</p>
            <p>Velocità: {velocita === undefined ? "—" : `${velocita} piedi`}</p>

            <h2>Lingue conosciute</h2>
            <ul>
                <li>Comune</li>
                <li>{lingue.find((lingua) => lingua.id === primaLinguaId)?.nome}</li>
                <li>{lingue.find((lingua) => lingua.id === secondaLinguaId)?.nome}</li>
            </ul>

            <h2>Caratteristiche</h2>
            <ul>
                {nomiCaratteristiche.map((caratteristica) => {
                    const punteggio = caratteristiche[caratteristica];

                    if (punteggio === null) return null;

                    const bonus = modificatore(punteggio);

                    return (
                        <li key={caratteristica}>
                            {caratteristica}: {punteggio} (
                            {bonus >= 0 ? "+" : ""}
                            {bonus})

                            <ul>
                                {abilita
                                    .filter((abilitaSingola) =>
                                        abilitaSingola.caratteristica === caratteristica
                                    )
                                    .map((abilitaSingola) => {
                                        const competente = abilitaCompetenti.includes(abilitaSingola.id);
                                        const bonusAbilita =
                                            bonus + (competente ? bonusCompetenza : 0);

                                        return (
                                            <li key={abilitaSingola.id}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={competente}
                                                        onChange={() =>
                                                            onCambiaCompetenzaAbilita(abilitaSingola.id)
                                                        }
                                                    />
                                                    {abilitaSingola.nome}: {bonusAbilita >= 0 ? "+" : ""}
                                                    {bonusAbilita}
                                                </label>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}

export default SchedaPersonaggio;