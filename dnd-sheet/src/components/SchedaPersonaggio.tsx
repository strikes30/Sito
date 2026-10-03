import { useState } from "react";
import lingue from "../data/lingue.json";
import abilita from "../data/abilita.json";
import SezioneRisorseClasse from "./scheda/SezioneRisorseClasse";

import {
    nomiCaratteristiche,
    type Caratteristica,
} from "../types/personaggio";

type Spell = {
    id: string;
    name: string;
    level: number;
    school: string;
    actionType: string;
    concentration: boolean;
    ritual: boolean;
    range: string;
    components: string[];
    material?: string;
    duration: string;
    description: string;
    higherLevelSlot?: string;
};

type Props = {
    // Dati generali del personaggio
    nome: string;
    livello: number;
    onSaliDiLivello: () => void;
    bonusCompetenza: number;

    // Dati della classe e della sottoclasse
    nomeClasse: string | undefined;
    dadoVita: number | undefined;
    puntiFeritaMassimi: number | null;

    sottoclasseId: string;
    onCambiaSottoclasse: (id: string) => void;
    sottoclassiDisponibili: {
        id: string;
        nome: string;
        classeId: string;
    }[];

    // Dati della razza
    nomeRazza: string | undefined;
    nomeSottorazza: string | undefined;
    tipoCreatura: string | undefined;
    taglia: string;
    velocita: number | undefined;

    // Lingue conosciute
    primaLinguaId: string;
    secondaLinguaId: string;

    // Caratteristiche e modificatori
    caratteristiche: Record<Caratteristica, number | null>;
    modificatore: (punteggio: number) => number;

    classeArmatura: number | null;

    abilitaCompetenti: string[];
    onCambiaCompetenzaAbilita: (id: string) => void;

    tiriSalvezzaCompetenti: string[];

    // Background
    nomeBackground: string | undefined;
    descrizioneBackground: string | undefined;
    abilitaBackground: string[];

    // Slot incantesimo o altre risorse della classe (come punti Ki del Monk o punti Patto del Warlock)
    slotMassimi: number[];
    risorsaClasseNome?: string;
    risorsaClasseId?: string;
    puntiRisorsaMassimi: number;
    puntiRisorsaSpesi: number;
    livelloSlotRisorsa: number;
    onCambiaPuntiRisorsaSpesi: (nuovoValore: number) => void;

    // Incantesimi e trucchetti
    massimoTrucchetti: number;
    massimoIncantesimiPreparati: number;

    spellDisponibili: Spell[];
    trucchettiScelti: string[];
    incantesimiScelti: string[];
    onCambiaTrucchetto: (id: string) => void;
    onCambiaIncantesimo: (id: string) => void;
};

// Vedi i dettagli della spell selezionata
function DettagliSpell({ spell }: { spell: Spell }) {
    return (
        <details>
            <summary>Dettagli</summary>

            <p>Tempo di lancio: {spell.actionType}</p>
            <p>Gittata: {spell.range}</p>
            <p>Durata: {spell.duration}</p>
            <p>Scuola: {spell.school}</p>
            <p>Componenti: {spell.components.join(", ").toUpperCase()}</p>

            {spell.material && (
                <p>Materiale: {spell.material}</p>
            )}

            {spell.concentration && <p>Richiede concentrazione</p>}
            {spell.ritual && <p>Rituale</p>}

            <p>{spell.description}</p>

            {spell.higherLevelSlot && (
                <p>
                    <strong>Slot di livello superiore:</strong>{" "}
                    {spell.higherLevelSlot}
                </p>
            )}
        </details>
    );
}


// Da qui inizia il componente principale della scheda del personaggio
function SchedaPersonaggio({
    nome,
    livello,
    onSaliDiLivello,
    bonusCompetenza,
    nomeClasse,
    sottoclasseId,
    onCambiaSottoclasse,
    sottoclassiDisponibili,
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
    massimoTrucchetti,
    massimoIncantesimiPreparati,
    spellDisponibili,
    trucchettiScelti,
    incantesimiScelti,
    onCambiaTrucchetto,
    onCambiaIncantesimo,
    risorsaClasseNome,
    risorsaClasseId,
    puntiRisorsaMassimi,
    puntiRisorsaSpesi,
    onCambiaPuntiRisorsaSpesi,
    livelloSlotRisorsa,
}: Props) {

    {/* Gestione dello stato degli slot consumati */ }
    const [slotConsumati, setSlotConsumati] = useState<Set<string>>(
        () => new Set()
    );

    function cambiaSlot(id: string) {
        setSlotConsumati((precedenti) => {
            const aggiornati = new Set(precedenti);

            if (aggiornati.has(id)) {
                aggiornati.delete(id);
            } else {
                aggiornati.add(id);
            }

            return aggiornati;
        });
    }

    // Gestione dello stato per nascondere gli incantesimi e trucchetti non scelti
    const [nascondiTrucchettiNonScelti, setNascondiTrucchettiNonScelti] =
        useState(false);

    const [nascondiIncantesimiNonScelti, setNascondiIncantesimiNonScelti] =
        useState(false);

    const trucchettiVisibili = spellDisponibili
        .filter(
            (spell) =>
                spell.level === 0 &&
                (!nascondiTrucchettiNonScelti || trucchettiScelti.includes(spell.id))
        )
        .sort((a, b) => a.name.localeCompare(b.name, "en"));

    const incantesimiVisibili = spellDisponibili
        .filter(
            (spell) =>
                spell.level > 0 &&
                (!nascondiIncantesimiNonScelti || incantesimiScelti.includes(spell.id))
        )
        .sort(
            (a, b) =>
                a.level - b.level || a.name.localeCompare(b.name, "en")
        );

    {/* Rendering della scheda del personaggio */ }
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

            {/* Sottoclasse */}
            {livello >= 3 && sottoclassiDisponibili.length > 0 && (
                <div>
                    <label htmlFor="sottoclasse">Sottoclasse</label>

                    <select
                        id="sottoclasse"
                        value={sottoclasseId}
                        onChange={(evento) => onCambiaSottoclasse(evento.target.value)}
                    >
                        <option value="">Seleziona una sottoclasse</option>

                        {sottoclassiDisponibili.map((sottoclasse) => (
                            <option key={sottoclasse.id} value={sottoclasse.id}>
                                {sottoclasse.nome}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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

            {/* Incantesimi */}
            <p>Trucchetti selezionabili: {massimoTrucchetti}</p>
            <p>Incantesimi preparabili: {massimoIncantesimiPreparati}</p>

            {/* Lista degli incantesimi disponibili */}
            {spellDisponibili.length > 0 && (
                <section>
                    <h2>Incantesimi</h2>

                    <h3>Trucchetti ({trucchettiScelti.length}/{massimoTrucchetti})</h3>

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



                    {/* Lista dei trucchetti disponibili */}
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

                    {/* Lista degli incantesimi disponibili */}
                    <h3>
                        Incantesimi ({incantesimiScelti.length}/{massimoIncantesimiPreparati})
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
            )}

            {/* Slot incantesimo */}
            {slotMassimi.some((quantita) => quantita > 0) && (
                <section>
                    <h2>Slot incantesimo</h2>

                    {slotMassimi.map((quantita, indice) =>
                        quantita > 0 ? (
                            <div key={indice}>
                                <span>Livello {indice + 1}: </span>

                                {Array.from({ length: quantita }, (_, indiceSlot) => {
                                    const id = `${indice}-${indiceSlot}`;

                                    return (
                                        <label key={id}>
                                            <input
                                                type="checkbox"
                                                checked={slotConsumati.has(id)}
                                                onChange={() => cambiaSlot(id)}
                                                aria-label={`Slot ${indiceSlot + 1} di livello ${indice + 1} consumato`}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        ) : null
                    )}
                </section>
            )}

            {/* Risorse della classe (come punti Ki del Monk o punti Patto del Warlock) */}
            <SezioneRisorseClasse
                id={risorsaClasseId}
                nome={risorsaClasseNome}
                massimi={puntiRisorsaMassimi}
                spesi={puntiRisorsaSpesi}
                livelloSlot={livelloSlotRisorsa}
                onCambiaSpesi={onCambiaPuntiRisorsaSpesi}
            />

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