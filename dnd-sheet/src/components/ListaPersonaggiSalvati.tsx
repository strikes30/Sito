import type { Personaggio } from "../types/personaggio";


type ListaPersonaggiSalvatiProps = {
  personaggi: Personaggio[];
  onApri: (id: string) => void;
  onElimina: (id: string) => void;
  onNuovoPersonaggio: () => void;
};


export function ListaPersonaggiSalvati({
  personaggi,
  onApri,
  onElimina,
  onNuovoPersonaggio,
}: ListaPersonaggiSalvatiProps) {
  return (
    <div>
      <h1>I tuoi personaggi</h1>

      <button type="button" onClick={onNuovoPersonaggio}>
        Crea nuovo personaggio
      </button>

      {personaggi.length === 0 ? (
        <p>Non hai ancora salvato nessun personaggio.</p>
      ) : (
        <ul>
          {personaggi.map((personaggio) => (
            <li key={personaggio.id}>
              <strong>{personaggio.nome}</strong>
              {" — "}
              Livello {personaggio.livello}
              {" — "}
              {personaggio.classeId}
              {" — "}
              {personaggio.razzaId}

              <button
                type="button"
                onClick={() => onApri(personaggio.id)}
              >
                Apri
              </button>

              <button
                type="button"
                onClick={() => onElimina(personaggio.id)}
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}