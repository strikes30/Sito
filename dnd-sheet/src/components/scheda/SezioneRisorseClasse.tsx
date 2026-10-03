type SezioneRisorseClasseProps = {
  id?: string;
  nome?: string;
  massimi: number;
  spesi: number;
  livelloSlot?: number;
  onCambiaSpesi: (nuovoValore: number) => void;
};

export default function SezioneRisorseClasse({
  id,
  nome,
  massimi,
  spesi,
  livelloSlot,
  onCambiaSpesi,
}: SezioneRisorseClasseProps) {
  if (!nome || massimi <= 0) {
    return null;
  }

  const disponibili = massimi - spesi;
  const eMagiaDelPatto = id === "magia-del-patto";

  return (
    <section>
      <h2>{nome}</h2>

      <p>
        {eMagiaDelPatto ? `Slot di livello ${livelloSlot}: ` : ""}
        {disponibili} / {massimi}
      </p>

      {Array.from({ length: massimi }, (_, indice) => (
        <label key={indice}>
          <input
            type="checkbox"
            checked={indice < spesi}
            onChange={() =>
              onCambiaSpesi(indice < spesi ? indice : indice + 1)
            }
            aria-label={
              eMagiaDelPatto
                ? `Slot di Magia del Patto ${indice + 1} speso`
                : `${nome} ${indice + 1} speso`
            }
          />
        </label>
      ))}

      <button type="button" onClick={() => onCambiaSpesi(0)}>
        Recupera tutti
      </button>
    </section>
  );
}