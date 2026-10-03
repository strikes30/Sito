type UseSlotIncantesimiParametri = {
  slotConsumati: string[];
  onCambiaSlotConsumati: (nuoviSlotConsumati: string[]) => void;
};


export function useSlotIncantesimi({
  slotConsumati,
  onCambiaSlotConsumati,
}: UseSlotIncantesimiParametri) {
  const slotConsumatiSet = new Set(slotConsumati);


  function cambiaSlot(id: string) {
    if (slotConsumatiSet.has(id)) {
      onCambiaSlotConsumati(
        slotConsumati.filter((slotId) => slotId !== id),
      );
      return;
    }

    onCambiaSlotConsumati([...slotConsumati, id]);
  }


  function resetSlotConsumati() {
    onCambiaSlotConsumati([]);
  }


  return {
    slotConsumati: slotConsumatiSet,
    cambiaSlot,
    resetSlotConsumati,
  };
}