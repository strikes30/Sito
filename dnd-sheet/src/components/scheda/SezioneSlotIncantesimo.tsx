type SezioneSlotIncantesimoProps = {
  slotMassimi: number[];
  slotConsumati: Set<string>;
  onCambiaSlot: (id: string) => void;
};

export default function SezioneSlotIncantesimo({
  slotMassimi,
  slotConsumati,
  onCambiaSlot,
}: SezioneSlotIncantesimoProps) {
  const haSlot = slotMassimi.some((quantita) => quantita > 0);

  if (!haSlot) {
    return null;
  }

  return (
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
                    onChange={() => onCambiaSlot(id)}
                    aria-label={`Slot ${indiceSlot + 1} di livello ${
                      indice + 1
                    } consumato`}
                  />
                </label>
              );
            })}
          </div>
        ) : null
      )}
    </section>
  );
}