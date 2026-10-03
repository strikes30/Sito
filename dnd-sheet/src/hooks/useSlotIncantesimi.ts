import { useState } from "react";

export function useSlotIncantesimi() {
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

  return {
    slotConsumati,
    cambiaSlot,
  };
}