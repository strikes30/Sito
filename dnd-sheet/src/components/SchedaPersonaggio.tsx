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

    tiriSalvezzaCompetenti: string[];

    nomeBackground: string | undefined;
    descrizioneBackground: string | undefined;
    abilitaBackground: string[];

    slotMassimi: number[];
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
    tiriSalvezzaCompetenti,
    nomeBackground,
    descrizioneBackground,
    abilitaBackground,
    slotMassimi,
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

            {/* Background */}
            <p>
                Background:{" "}
                <span title={descrizioneBackground ?? ""}>
                    {nomeBackground ?? "—"}
                </span>
            </p>

            {/* Razza */}
            <p>Tipo di creatura: {tipoCreatura}</p>
            <p>Taglia: {taglia}</p>
            <p>Velocità: {velocita === undefined ? "—" : `${velocita} piedi`}</p>

            {/* Lingue */}
            <h2>Lingue conosciute</h2>
            <ul>
                <li>Comune</li>
                <li>{lingue.find((lingua) => lingua.id === primaLinguaId)?.nome}</li>
                <li>{lingue.find((lingua) => lingua.id === secondaLinguaId)?.nome}</li>
            </ul>

            {/* Slot incantesimo */}
            {slotMassimi.some((quantita) => quantita > 0) && (
                <section>
                    <h2>Slot incantesimo</h2>

                    {slotMassimi.map((quantita, indice) =>
                        quantita > 0 ? (
                            <div key={indice}>
                                Livello {indice + 1}: {quantita} slot
                            </div>
                        ) : null
                    )}
                </section>
            )}

            {/* Caratteristiche */}
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

                            {/* Mostra le competenza tiri salvezza */}
                            {(() => {
                                const competente = tiriSalvezzaCompetenti.includes(caratteristica);
                                const bonusTiroSalvezza =
                                    bonus + (competente ? bonusCompetenza : 0);

                                return (
                                    <p>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={competente}
                                                readOnly
                                            />
                                            Tiro salvezza: {bonusTiroSalvezza >= 0 ? "+" : ""}
                                            {bonusTiroSalvezza}
                                        </label>
                                    </p>
                                );
                            })()}

                            {/* Mostra abilità */}
                            <ul>
                                {abilita
                                    .filter(
                                        (abilitaSingola) =>
                                            abilitaSingola.caratteristica === caratteristica,
                                    )
                                    .map((abilitaSingola) => {
                                        const competenteDaBackground = abilitaBackground.includes(
                                            abilitaSingola.id,
                                        );

                                        const competente =
                                            competenteDaBackground ||
                                            abilitaCompetenti.includes(abilitaSingola.id);

                                        const bonusAbilita =
                                            bonus + (competente ? bonusCompetenza : 0);

                                        return (
                                            <li key={abilitaSingola.id}>
                                                <label title={abilitaSingola.descrizione}>
                                                    <input
                                                        type="checkbox"
                                                        checked={competente}
                                                        disabled={competenteDaBackground}
                                                        onChange={() =>
                                                            onCambiaCompetenzaAbilita(abilitaSingola.id)
                                                        }
                                                    />
                                                    {abilitaSingola.nome}:{" "}
                                                    {bonusAbilita >= 0 ? "+" : ""}
                                                    {bonusAbilita}
                                                    {competenteDaBackground && " (background)"}
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