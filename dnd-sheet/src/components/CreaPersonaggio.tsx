import type { BozzaPersonaggio } from "../types/bozzaPersonaggio";
import type { AzioneBozza } from "../engine/bozzaPersonaggioReducer";
import classi from "../data/classi.json";
import razze from "../data/razze.json";
import lingue from "../data/lingue.json";
import backgrounds from "../data/background.json";

const nomiCaratteristiche = [
    "Forza",
    "Destrezza",
    "Costituzione",
    "Intelligenza",
    "Saggezza",
    "Carisma",
] as const;

type Caratteristica = (typeof nomiCaratteristiche)[number];

const valoriStandard = [15, 14, 13, 12, 10, 8];

type Props = {
    bozza: BozzaPersonaggio;
    dispatchBozza: React.Dispatch<AzioneBozza>;
    cambiaCaratteristica: (
        caratteristica: Caratteristica,
        nuovoValore: number | null,
    ) => void;
    creaPersonaggio: (evento: React.SubmitEvent<HTMLFormElement>) => void;
    caricaPersonaggioDiProva: () => void;
    erroriForm: string[];
};

export function CreaPersonaggio({
    bozza,
    dispatchBozza,
    cambiaCaratteristica,
    creaPersonaggio,
    caricaPersonaggioDiProva,
    erroriForm,
}: Props) {

    // Ottieni la razza selezionata in base all'ID della razza
    const razzaSelezionata = razze.find(
        (razza) => razza.id === bozza.razzaId,
    );

    // Ottieni le sottorazze disponibili per la razza selezionata
    const sottorazzeDisponibili = razzaSelezionata?.sottorazze ?? [];

    // Ottieni il background selezionato in base all'ID del background
    const backgroundSelezionato = backgrounds.find(
        (background) => background.id === bozza.backgroundId,
    );

    const lingueIniziali = lingue
        .filter(
            (lingua) =>
                lingua.categoria === "standard" &&
                lingua.id !== "comune",
        )
        .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"));

    return (
        <main>
            <h1>Crea il personaggio</h1>

            <button
                type="button"
                onClick={caricaPersonaggioDiProva}
            >
                Carica personaggio di prova
            </button>

            {/* Gruppo per il nome del personaggio */}
            <form onSubmit={creaPersonaggio}>

                {/* Mostra gli errori del form se presenti */}
                {erroriForm.length > 0 && (
                    <section
                        role="alert"
                        aria-labelledby="errori-form"
                    >
                        <h2 id="errori-form">Correggi questi punti</h2>
                        <ul>
                            {erroriForm.map((errore) => (
                                <li key={errore}>{errore}</li>
                            ))}
                        </ul>
                    </section>
                )}
                
                {/* Gruppo per il nome del personaggio */}
                <div>
                    <label htmlFor="nome">Nome: </label>
                    <input
                        id="nome"
                        type="text"
                        value={bozza.nome}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "CAMBIA_CAMPO",
                                campo: "nome",
                                valore: evento.target.value,
                            })
                        }
                    />
                </div>

                {/* Gruppo per la classe del personaggio */}
                <div>
                    <label htmlFor="classe">Classe: </label>
                    <select
                        id="classe"
                        value={bozza.classeId}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "SELEZIONA_CLASSE",
                                classeId: evento.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Seleziona una classe</option>

                        {classi
                            .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"))
                            .map((voce) => (
                                <option key={voce.id} value={voce.id}>
                                    {voce.nome}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Gruppo per la razza e sottorazza del personaggio */}
                <div>
                    <label htmlFor="razza">Razza: </label>

                    <select
                        id="razza"
                        value={bozza.razzaId}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "SELEZIONA_RAZZA",
                                razzaId: evento.target.value,
                            })
                        }
                    >
                        <option value="">Seleziona una razza</option>

                        {razze
                            .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"))
                            .map((razza) => (
                                <option key={razza.id} value={razza.id}>
                                    {razza.nome}
                                </option>
                            ))}
                    </select>
                </div>

                {razzaSelezionata && sottorazzeDisponibili.length > 0 && (
                    <div>
                        <label htmlFor="sottorazza">Sottorazza: </label>

                        <select
                            id="sottorazza"
                            value={bozza.sottorazzaId}
                            onChange={(evento) =>
                                dispatchBozza({
                                    type: "CAMBIA_CAMPO",
                                    campo: "sottorazzaId",
                                    valore: evento.target.value,
                                })
                            }
                        >
                            <option value="">Seleziona una sottorazza</option>

                            {sottorazzeDisponibili.map((sottorazza) => (
                                <option key={sottorazza.id} value={sottorazza.id}>
                                    {sottorazza.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {razzaSelezionata && (
                    <div>
                        <label htmlFor="taglia">Taglia: </label>

                        {razzaSelezionata.taglie.length === 1 ? (
                            <span>{razzaSelezionata.taglie[0]}</span>
                        ) : (
                            <select
                                id="taglia"
                                value={bozza.taglia}
                                onChange={(evento) =>
                                    dispatchBozza({
                                        type: "CAMBIA_CAMPO",
                                        campo: "taglia",
                                        valore: evento.target.value,
                                    })
                                }
                            >
                                <option value="">Seleziona una taglia</option>

                                {razzaSelezionata.taglie.map((opzione) => (
                                    <option key={opzione} value={opzione}>
                                        {opzione}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Gruppo per il background del personaggio */}
                <h2>Background</h2>
                <p>Scegli un background per il tuo personaggio.</p>
                <div>
                    <label htmlFor="background">Background</label>
                    <select
                        id="background"
                        value={bozza.backgroundId}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "SELEZIONA_BACKGROUND",
                                backgroundId: evento.target.value,
                            })
                        }
                    >
                        <option value="">Seleziona un background</option>

                        {backgrounds.map((background) => (
                            <option key={background.id} value={background.id}>
                                {background.nome}
                            </option>
                        ))}
                    </select>

                    {backgroundSelezionato && (
                        <p>{backgroundSelezionato.descrizione}</p>
                    )}

                    {backgroundSelezionato && (
                        <fieldset>
                            <legend>Aumenti delle caratteristiche del background</legend>

                            <label htmlFor="distribuzione-background">Distribuzione:</label>

                            <select
                                id="distribuzione-background"
                                value={bozza.distribuzioneBackground}
                                onChange={(evento) =>
                                    dispatchBozza({
                                        type: "CAMBIA_DISTRIBUZIONE",
                                        valore: evento.target.value as "due" | "tre",
                                    })
                                }
                            >
                                <option value="">Scegli come distribuire i punti</option>
                                <option value="due">+2 a una caratteristica e +1 a un’altra</option>
                                <option value="tre">+1 a tutte e tre le caratteristiche</option>
                            </select>

                            {bozza.distribuzioneBackground === "due" && (
                                <>
                                    <label htmlFor="background-piu-due">Caratteristica +2:</label>
                                    <select
                                        id="background-piu-due"
                                        value={bozza.caratteristicaPiuDue}
                                        onChange={(evento) =>
                                            dispatchBozza({
                                                type: "CAMBIA_CAMPO",
                                                campo: "caratteristicaPiuDue",
                                                valore: evento.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Seleziona</option>
                                        {backgroundSelezionato.caratteristicheDisponibili.map((voce) => (
                                            <option
                                                key={voce}
                                                value={voce}
                                                disabled={voce === bozza.caratteristicaPiuUno}
                                            >
                                                {voce}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="background-piu-uno">Caratteristica +1:</label>
                                    <select
                                        id="background-piu-uno"
                                        value={bozza.caratteristicaPiuUno}
                                        onChange={(evento) =>
                                            dispatchBozza({
                                                type: "CAMBIA_CAMPO",
                                                campo: "caratteristicaPiuUno",
                                                valore: evento.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">Seleziona</option>
                                        {backgroundSelezionato.caratteristicheDisponibili.map((voce) => (
                                            <option
                                                key={voce}
                                                value={voce}
                                                disabled={voce === bozza.caratteristicaPiuDue}
                                            >
                                                {voce}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {bozza.distribuzioneBackground === "tre" && (
                                <p>
                                    +1 a{" "}
                                    {backgroundSelezionato.caratteristicheDisponibili.join(", ")}
                                </p>
                            )}
                        </fieldset>
                    )}
                </div>

                {/* Gruppo per le lingue del personaggio */}
                <h2>Lingue</h2>
                <p>Conosci già: Comune. Scegli altre due lingue standard.</p>

                <div>
                    <label htmlFor="prima-lingua">Prima lingua: </label>
                    <select
                        id="primaLingua"
                        value={bozza.primaLinguaId}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "CAMBIA_CAMPO",
                                campo: "primaLinguaId",
                                valore: evento.target.value,
                            })
                        }
                    >
                        <option value="">Seleziona una lingua</option>

                        {lingueIniziali.map((lingua) => (
                            <option
                                key={lingua.id}
                                value={lingua.id}
                                disabled={lingua.id === bozza.secondaLinguaId}
                            >
                                {lingua.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="seconda-lingua">Seconda lingua: </label>
                    <select
                        id="secondaLingua"
                        value={bozza.secondaLinguaId}
                        onChange={(evento) =>
                            dispatchBozza({
                                type: "CAMBIA_CAMPO",
                                campo: "secondaLinguaId",
                                valore: evento.target.value,
                            })
                        }
                    >
                        <option value="">Seleziona una lingua</option>

                        {lingueIniziali.map((lingua) => (
                            <option
                                key={lingua.id}
                                value={lingua.id}
                                disabled={lingua.id === bozza.primaLinguaId}
                            >
                                {lingua.nome}
                            </option>
                        ))}
                    </select>
                </div>



                {/* Gruppo per le caratteristiche del personaggio */}
                <h2>Caratteristiche</h2>

                {nomiCaratteristiche.map((caratteristica) => (
                    <div key={caratteristica}>
                        <label htmlFor={caratteristica}>
                            {caratteristica}:{" "}
                        </label>

                        <select
                            id={caratteristica}
                            value={bozza.caratteristiche[caratteristica] ?? ""}
                            onChange={(evento) =>
                                cambiaCaratteristica(
                                    caratteristica,
                                    evento.target.value === ""
                                        ? null
                                        : Number(evento.target.value),
                                )
                            }
                            required
                        >
                            <option value="">Seleziona un valore</option>

                            {valoriStandard.map((valore) => {
                                const usatoDaUnAltraCaratteristica =
                                    nomiCaratteristiche.some(
                                        (altra) =>
                                            altra !== caratteristica &&
                                            bozza.caratteristiche[altra] === valore,
                                    );

                                return (
                                    <option
                                        key={valore}
                                        value={valore}
                                        disabled={usatoDaUnAltraCaratteristica}
                                    >
                                        {valore}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                ))}

                <button type="submit">Crea personaggio</button>
            </form>
        </main>
    );
}

export default CreaPersonaggio;