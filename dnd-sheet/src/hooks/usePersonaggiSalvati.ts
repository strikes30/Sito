import { useEffect, useState } from "react";
import type { Personaggio } from "../types/personaggio";


const CHIAVE_ARCHIVIO = "dnd-sheet.personaggi.v1";


function caricaPersonaggiSalvati(): Personaggio[] {
  try {
    const datiSalvati = localStorage.getItem(CHIAVE_ARCHIVIO);

    if (!datiSalvati) {
      return [];
    }

    const dati = JSON.parse(datiSalvati);

    if (!Array.isArray(dati)) {
      return [];
    }

    return dati as Personaggio[];
  } catch {
    return [];
  }
}


export function usePersonaggiSalvati() {
  const [personaggiSalvati, setPersonaggiSalvati] = useState<Personaggio[]>(
    caricaPersonaggiSalvati,
  );


  useEffect(() => {
    try {
      localStorage.setItem(
        CHIAVE_ARCHIVIO,
        JSON.stringify(personaggiSalvati),
      );
    } catch {
      // Se localStorage non è disponibile o è pieno,
      // manteniamo comunque i dati nella sessione corrente.
    }
  }, [personaggiSalvati]);


  function salvaPersonaggio(personaggio: Personaggio) {
    setPersonaggiSalvati((precedenti) => {
      const giaSalvato = precedenti.some(
        (precedente) => precedente.id === personaggio.id,
      );

      if (giaSalvato) {
        return precedenti.map((precedente) =>
          precedente.id === personaggio.id
            ? personaggio
            : precedente,
        );
      }

      return [...precedenti, personaggio];
    });
  }


  function eliminaPersonaggio(id: string) {
    setPersonaggiSalvati((precedenti) =>
      precedenti.filter((personaggio) => personaggio.id !== id),
    );
  }


  function cercaPersonaggio(id: string): Personaggio | undefined {
    return personaggiSalvati.find(
      (personaggio) => personaggio.id === id,
    );
  }


  return {
    personaggiSalvati,
    salvaPersonaggio,
    eliminaPersonaggio,
    cercaPersonaggio,
  };
}