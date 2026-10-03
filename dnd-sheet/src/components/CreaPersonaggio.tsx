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
    nome: string;
    setNome: (valore: string) => void;

    classe: string;
    setClasse: (valore: string) => void;

    razzaId: string;
    setRazzaId: (valore: string) => void;

    sottorazzaId: string;
    setSottorazzaId: (valore: string) => void;

    taglia: string;
    setTaglia: (valore: string) => void;

    primaLinguaId: string;
    setPrimaLinguaId: (valore: string) => void;

    secondaLinguaId: string;
    setSecondaLinguaId: (valore: string) => void;

    caratteristiche: Record<Caratteristica, number | null>;
    cambiaCaratteristica: (
        caratteristica: Caratteristica,
        valore: number | null,
    ) => void;

    backgroundId: string;
    setBackgroundId: (valore: string) => void;

    distribuzioneBackground: "" | "due" | "tre";
    setDistribuzioneBackground: (valore: "" | "due" | "tre") => void;
    caratteristicaPiuDue: string;
    setCaratteristicaPiuDue: (valore: string) => void;
    caratteristicaPiuUno: string;
    setCaratteristicaPiuUno: (valore: string) => void;

    creaPersonaggio: (evento: React.SubmitEvent<HTMLFormElement>) => void;

    caricaPersonaggioDiProva: () => void;
};

function CreaPersonaggio({
    nome,
    setNome,
    classe,
    setClasse,
    razzaId,
    setRazzaId,
    sottorazzaId,
    setSottorazzaId,
    taglia,
    setTaglia,
    primaLinguaId,
    setPrimaLinguaId,
    secondaLinguaId,
    setSecondaLinguaId,
    caratteristiche,
    cambiaCaratteristica,
    backgroundId,
    setBackgroundId,
    creaPersonaggio,
    distribuzioneBackground,
    setDistribuzioneBackground,
    caratteristicaPiuDue,
    setCaratteristicaPiuDue,
    caratteristicaPiuUno,
    setCaratteristicaPiuUno,
    caricaPersonaggioDiProva,
}: Props) {

    // Ottieni la razza selezionata in base all'ID della razza
    const razzaSelezionata = razze.find(
        (razza) => razza.id === razzaId,
    );

    // Ottieni le sottorazze disponibili per la razza selezionata
    const sottorazzeDisponibili = razzaSelezionata?.sottorazze ?? [];

    // Ottieni il background selezionato in base all'ID del background
    const backgroundSelezionato = backgrounds.find(
        (background) => background.id === backgroundId,
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
                <div>
                    <label htmlFor="nome">Nome: </label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(evento) => setNome(evento.target.value)}
                    />
                </div>

                {/* Gruppo per la classe del personaggio */}
                <div>
                    <label htmlFor="classe">Classe: </label>
                    <select
                        id="classe"
                        value={classe}
                        onChange={(evento) => setClasse(evento.target.value)}
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
                        value={razzaId}
                        onChange={(evento) => {
                            const nuovoId = evento.target.value;
                            const nuovaRazza = razze.find((razza) => razza.id === nuovoId);

                            setRazzaId(nuovoId);
                            setSottorazzaId("");

                            setTaglia(
                                nuovaRazza?.taglie.length === 1
                                    ? nuovaRazza.taglie[0]
                                    : "",
                            );
                        }}
                        required
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
                            value={sottorazzaId}
                            onChange={(evento) => setSottorazzaId(evento.target.value)}
                            required
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
                                value={taglia}
                                onChange={(evento) => setTaglia(evento.target.value)}
                                required
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
                        value={backgroundId}
                        onChange={(evento) => {
                            setBackgroundId(evento.target.value);
                            setDistribuzioneBackground("");
                            setCaratteristicaPiuDue("");
                            setCaratteristicaPiuUno("");
                        }}
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
                                value={distribuzioneBackground}
                                onChange={(evento) => {
                                    const valore = evento.target.value as "" | "due" | "tre";
                                    setDistribuzioneBackground(valore);
                                    setCaratteristicaPiuDue("");
                                    setCaratteristicaPiuUno("");
                                }}
                                required
                            >
                                {/* Opzioni per la distribuzione dei bonus di caratteristica del background */}
                                <option value="">Scegli come distribuire i punti</option>
                                <option value="due">+2 a una caratteristica e +1 a un’altra</option>
                                <option value="tre">+1 a tutte e tre le caratteristiche</option>
                            </select>

                            {distribuzioneBackground === "due" && (
                                <>
                                    <label htmlFor="background-piu-due">Caratteristica +2:</label>
                                    <select
                                        id="background-piu-due"
                                        value={caratteristicaPiuDue}
                                        onChange={(evento) =>
                                            setCaratteristicaPiuDue(evento.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Seleziona</option>
                                        {backgroundSelezionato.caratteristicheDisponibili.map((voce) => (
                                            <option
                                                key={voce}
                                                value={voce}
                                                disabled={voce === caratteristicaPiuUno}
                                            >
                                                {voce}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="background-piu-uno">Caratteristica +1:</label>
                                    <select
                                        id="background-piu-uno"
                                        value={caratteristicaPiuUno}
                                        onChange={(evento) =>
                                            setCaratteristicaPiuUno(evento.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Seleziona</option>
                                        {backgroundSelezionato.caratteristicheDisponibili.map((voce) => (
                                            <option
                                                key={voce}
                                                value={voce}
                                                disabled={voce === caratteristicaPiuDue}
                                            >
                                                {voce}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {distribuzioneBackground === "tre" && (
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
                        id="prima-lingua"
                        value={primaLinguaId}
                        onChange={(evento) => setPrimaLinguaId(evento.target.value)}
                        required
                    >
                        <option value="">Seleziona una lingua</option>

                        {lingueIniziali.map((lingua) => (
                            <option
                                key={lingua.id}
                                value={lingua.id}
                                disabled={lingua.id === secondaLinguaId}
                            >
                                {lingua.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="seconda-lingua">Seconda lingua: </label>
                    <select
                        id="seconda-lingua"
                        value={secondaLinguaId}
                        onChange={(evento) => setSecondaLinguaId(evento.target.value)}
                        required
                    >
                        <option value="">Seleziona una lingua</option>

                        {lingueIniziali.map((lingua) => (
                            <option
                                key={lingua.id}
                                value={lingua.id}
                                disabled={lingua.id === primaLinguaId}
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
                            value={caratteristiche[caratteristica] ?? ""}
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
                                            caratteristiche[altra] === valore,
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