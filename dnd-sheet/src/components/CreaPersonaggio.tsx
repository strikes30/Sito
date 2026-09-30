import classi from "../data/classi.json";
import razze from "../data/razze.json";
import lingue from "../data/lingue.json";

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

    creaPersonaggio: (evento: React.SubmitEvent<HTMLFormElement>) => void;
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
    creaPersonaggio,
}: Props) {
    const razzaSelezionata = razze.find(
        (razza) => razza.id === razzaId,
    );

    const sottorazzeDisponibili = razzaSelezionata?.sottorazze ?? [];

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