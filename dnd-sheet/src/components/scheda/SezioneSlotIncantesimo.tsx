import { useState } from "react";

type SezioneSlotIncantesimoProps = {
  slotMassimi: number[];
};

export default function SezioneSlotIncantesimo({
  slotMassimi,
}: SezioneSlotIncantesimoProps) {
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
                    onChange={() => cambiaSlot(id)}
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