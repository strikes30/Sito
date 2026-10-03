import { useEffect, useReducer, useState } from "react";

import { bozzaPersonaggioReducer } from "./engine/bozzaPersonaggioReducer";
import { bozzaIniziale } from "./types/bozzaPersonaggio";

import CreaPersonaggio from "./components/CreaPersonaggio";
import SchedaPersonaggio from "./components/SchedaPersonaggio";
import progressioneSlot from "./data/progressionSlot.json";
import progressioneIncantesimi from "./data/progressionSpell.json";
import spells from "./data/spells.json";

import { useRisorseClasse } from "./hooks/useRisorseClasse";

import {
  calcolaLivelloMassimoIncantesimo,
  filtraSpellDisponibili,
} from "./utils/calcoliIncantesimi";

import { useIncantesimi } from "./hooks/useIncantesimi";

import { useSlotIncantesimi } from "./hooks/useSlotIncantesimi";

import {
  calcolaLivelloSlotRisorsa,
  calcolaPuntiRisorsaMassimi,
} from "./utils/calcoliRisorse";


import {
  type Caratteristica,
  type Personaggio,
} from "./types/personaggio";

import {
  costruisciPersonaggio,
} from "./engine/costruisciPersonaggio";

import {
  modificatore,
} from "./utils/calcoliPersonaggio";

import { calcolaStatisticheDerivate } from "./utils/calcolaStatisticheDerivate";

import { calcolaCaratteristicheFinali } from "./utils/calcolaCaratteristicheFinali";

import { validaBozzaPersonaggio } from "./engine/validaBozzaPersonaggio";

// Importa i dati di gioco dai file JSON
import backgroundsJson from "./data/background.json";
import classiJson from "./data/classi.json";
import razzeJson from "./data/razze.json";
import lingueJson from "./data/lingue.json";
import sottoclassiJson from "./data/sottoclassi.json";

// Importa i componenti e gli hook necessari per la gestione dei personaggi salvati
import { ListaPersonaggiSalvati } from "./components/ListaPersonaggiSalvati";
import { usePersonaggiSalvati } from "./hooks/usePersonaggiSalvati";

import type {
  Background,
  Classe,
  Lingua,
  Razza,
  Sottoclasse,
} from "./types/datiGioco";

// Tipi per la gestione della vista corrente dell'applicazione
type Vista =
  | { nome: "lista" }
  | { nome: "creazione" }
  | { nome: "scheda"; personaggioId: string };

const backgrounds = backgroundsJson as Background[];
const classi = classiJson as Classe[];
const razze = razzeJson as Razza[];
const lingue = lingueJson as Lingua[];
const sottoclassi = sottoclassiJson as Sottoclasse[];

// Tipi per la progressione degli incantesimi
type RegoleIncantesimi = {
  sceltaDa: string;
  listaIncantesimi?: string;
  trucchetti: number[];
  preparati: number[];
};

// Mappa delle progressioni degli incantesimi per classe
const progressioniIncantesimi: Record<
  string,
  RegoleIncantesimi | undefined
> = progressioneIncantesimi;

//////////////////CODICE SITO VISIBILE////////////////////

function App() {

  const [vista, setVista] = useState<Vista>({ nome: "lista" });

  const {
    personaggiSalvati,
    salvaPersonaggio,
    eliminaPersonaggio,
    cercaPersonaggio,
  } = usePersonaggiSalvati();

  // Stato per la bozza del personaggio in fase di creazione
  const [bozza, dispatchBozza] = useReducer(
    bozzaPersonaggioReducer,
    bozzaIniziale,
  );

  // Stato per il personaggio creato, inizialmente nullo
  const [personaggio, setPersonaggio] =
    useState<Personaggio | null>(null);

  // Effetto per salvare il personaggio creato nel localStorage quando cambia
  useEffect(() => {
    if (!personaggio || vista.nome !== "scheda") {
      return;
    }

    salvaPersonaggio(personaggio);
  }, [personaggio, salvaPersonaggio, vista.nome]);

  // Determina il livello corrente del personaggio, se esiste, altrimenti assume il livello 1
  const livelloCorrente = personaggio?.livello ?? 1;

  const [erroriForm, setErroriForm] = useState<string[]>([]); // Stato per gli errori di validazione del form

  // Determina l'ID della classe corrente, prendendo in considerazione sia il personaggio che la bozza
  const classeCorrenteId =
    personaggio?.classeId ?? bozza.classeId;

  const sottoclasseCorrenteId =
    personaggio?.sottoclasseId ?? bozza.sottoclasseId;

  // Filtra le sottoclassi disponibili in base alla classe selezionata
  const sottoclassiDisponibili = sottoclassi.filter(
    (voce) => voce.classeId === classeCorrenteId
  );

  const sottoclasseSelezionata = sottoclassiDisponibili.find(
    (voce) => voce.id === sottoclasseCorrenteId
  );

  // Filtra le lingue iniziali, escludendo la lingua "comune" e ordinandole alfabeticamente
  const lingueIniziali = lingue
    .filter((lingua) =>
      lingua.categoria === "standard" && lingua.id !== "comune"
    )
    .toSorted((a, b) => a.nome.localeCompare(b.nome, "it"));

  // Funzione per cambiare il valore di una caratteristica
  function cambiaCaratteristica(
    caratteristica: Caratteristica,
    nuovoValore: number | null,
  ) {
    dispatchBozza({
      type: "CAMBIA_CARATTERISTICA",
      caratteristica,
      valore: nuovoValore,
    });
  }

  // Cerca nel JSON la razza che ha l'ID scelto dall'utente
  const razzaSelezionata = razze.find(
    (razza) => razza.id === bozza.razzaId,
  );

  // Cerca nel JSON la sottorazza che ha l'ID scelto dall'utente
  const sottorazzaSelezionata = razzaSelezionata?.sottorazze.find(
    (sottorazza) => sottorazza.id === bozza.sottorazzaId,
  );

  // Cerca nel JSON il background che ha l'ID scelto dall'utente
  const backgroundSelezionato = backgrounds.find(
    (background) => background.id === bozza.backgroundId,
  );

  // Calcola le caratteristiche finali del personaggio, tenendo conto dei bonus del background
  const caratteristicheFinali = calcolaCaratteristicheFinali(
    bozza.caratteristiche,
    backgroundSelezionato,
    bozza.distribuzioneBackground,
    bozza.caratteristicaPiuDue,
    bozza.caratteristicaPiuUno,
  );

  // Funzione per creare il personaggio, con controlli di validità
  function creaPersonaggio(
    evento: React.FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault();

    const errori = validaBozzaPersonaggio({
      bozza,
      razzaSelezionata,
      sottorazzaSelezionata,
      backgroundSelezionato,
      lingueIniziali,
    });

    if (errori.length > 0) {
      setErroriForm(errori);
      return;
    }

    setErroriForm([]);

    const nuovoPersonaggio = costruisciPersonaggio(
      bozza,
      caratteristicheFinali,
    );

    salvaPersonaggio(nuovoPersonaggio);
    setPersonaggio(nuovoPersonaggio);
    setVista({
      nome: "scheda",
      personaggioId: nuovoPersonaggio.id,
    });
  }

  // Funzione per caricare un personaggio di prova, utile per testare l'applicazione
  function caricaPersonaggioDiProva() {
    const razzaProva = razze.find((razza) => razza.id === "umano");

    dispatchBozza({
      type: "CARICA_BOZZA",
      bozza: {
        ...bozzaIniziale,
        nome: "Personaggio",
        classeId: "warlock",
        razzaId: razzaProva?.id ?? "",
        sottorazzaId: "",
        taglia: razzaProva?.taglie[0] ?? "",
        primaLinguaId: "elfico",
        secondaLinguaId: "nanico",
        backgroundId: "accolito",
        distribuzioneBackground: "tre",
        caratteristicaPiuDue: "",
        caratteristicaPiuUno: "",
        caratteristiche: {
          Forza: 10,
          Destrezza: 15,
          Costituzione: 14,
          Intelligenza: 13,
          Saggezza: 12,
          Carisma: 8,
        },
      },
    });
  }

  // Funzione per aprire un personaggio salvato dalla lista
  function apriPersonaggioSalvato(id: string) {
    const personaggioSalvato = cercaPersonaggio(id);

    if (!personaggioSalvato) {
      return;
    }

    setPersonaggio(personaggioSalvato);
    setVista({
      nome: "scheda",
      personaggioId: id,
    });
  }


  function creaNuovoPersonaggio() {
    dispatchBozza({ type: "RESET" });
    setPersonaggio(null);
    setErroriForm([]);
    setVista({ nome: "creazione" });
  }

  function tornaAllaLista() {
    setPersonaggio(null);
    setErroriForm([]);
    setVista({ nome: "lista" });
  }

  // Funzione per cambiare lo stato di competenza di un'abilita
  function cambiaCompetenzaAbilita(id: string) {
    setPersonaggio((precedente) => {
      if (!precedente) {
        return precedente;
      }

      const abilitaCompetentiAggiornate =
        precedente.abilitaCompetenti.includes(id)
          ? precedente.abilitaCompetenti.filter(
            (abilitaId) => abilitaId !== id,
          )
          : [...precedente.abilitaCompetenti, id];

      return {
        ...precedente,
        abilitaCompetenti: abilitaCompetentiAggiornate,
      };
    });
  }

  // Funzioni per cambiare i trucchetti e gli incantesimi scelti del personaggio
  function cambiaTrucchettiPersonaggio(nuoviTrucchetti: string[]) {
    setPersonaggio((precedente) =>
      precedente
        ? {
          ...precedente,
          trucchettiScelti: nuoviTrucchetti,
        }
        : precedente,
    );
  }

  // Funzioni per cambiare i trucchetti e gli incantesimi scelti del personaggio
  function cambiaIncantesimiPersonaggio(nuoviIncantesimi: string[]) {
    setPersonaggio((precedente) =>
      precedente
        ? {
          ...precedente,
          incantesimiScelti: nuoviIncantesimi,
        }
        : precedente,
    );
  }

  // Funzione per cambiare gli slot consumati del personaggio
  function cambiaSlotConsumatiPersonaggio(
    nuoviSlotConsumati: string[],
  ) {
    setPersonaggio((precedente) =>
      precedente
        ? {
          ...precedente,
          slotConsumati: nuoviSlotConsumati,
        }
        : precedente,
    );
  }

  // Funzione per cambiare i punti risorsa spesi del personaggio
  function cambiaPuntiRisorsaSpesiPersonaggio(nuovoValore: number) {
    setPersonaggio((precedente) =>
      precedente
        ? {
          ...precedente,
          puntiRisorsaSpesi: nuovoValore,
        }
        : precedente,
    );
  }

  /////////// CALCOLO DEI TRUCCHETTI E DEGLI INCANTESIMI PREPARATI //////////

  // Hook personalizzato per gestire gli slot degli incantesimi
  const { slotConsumati, cambiaSlot } = useSlotIncantesimi({
    slotConsumati: personaggio?.slotConsumati ?? [],
    onCambiaSlotConsumati: cambiaSlotConsumatiPersonaggio,
  });

  // Cerca nel JSON la classe che ha l'ID scelto dall'utente
  const classeSelezionata = classi.find(
    (voce) => voce.id === classeCorrenteId
  );

  // Determina il tipo di progressione degli slot in base alla classe selezionata
  const tipoProgressione =
    livelloCorrente >= 3 && sottoclasseSelezionata?.progressioneSlot
      ? sottoclasseSelezionata.progressioneSlot
      : classeSelezionata?.progressioneSlot;

  const slotMassimi: number[] =
    tipoProgressione === "completa" ||
      tipoProgressione === "metà" ||
      tipoProgressione === "terzo"
      ? progressioneSlot[tipoProgressione][livelloCorrente - 1] ?? []
      : [];

  // Determina la risorsa della classe selezionata, se presente (tipo il Monk ha i punti Ki, il Warlock ha i punti Patto, ecc.)
  const risorsaClasse = classeSelezionata?.risorsaClasse;

  const puntiRisorsaMassimi = calcolaPuntiRisorsaMassimi(
    risorsaClasse,
    livelloCorrente
  );

  const livelloSlotRisorsa = calcolaLivelloSlotRisorsa(
    risorsaClasse,
    livelloCorrente
  );

  // Determina le regole degli incantesimi in base alla classe o sottoclasse selezionata
  const regoleClasse = progressioniIncantesimi[classeCorrenteId];

  // Determina le regole degli incantesimi in base alla sottoclasse selezionata, se il livello è almeno 3
  const regoleSottoclasse =
    livelloCorrente >= 3 && sottoclasseSelezionata
      ? progressioniIncantesimi[sottoclasseSelezionata.id]
      : undefined;

  // Determina le regole degli incantesimi da usare, dando priorità alla sottoclasse se presente
  const regoleIncantesimi = regoleClasse ?? regoleSottoclasse;

  const massimoTrucchetti =
    regoleIncantesimi?.trucchetti[livelloCorrente - 1] ?? 0;

  const massimoIncantesimiPreparati =
    regoleIncantesimi?.preparati[livelloCorrente - 1] ?? 0;

  // Determina la lista di incantesimi disponibili in base alla classe o sottoclasse selezionata
  const listaIncantesimi =
    regoleIncantesimi?.listaIncantesimi ?? classeCorrenteId;

  const livelloMassimoSpell = calcolaLivelloMassimoIncantesimo(
    classeCorrenteId,
    slotMassimi,
    classeSelezionata?.risorsaClasse?.livelloSlotPerLivello?.[livelloCorrente - 1]
  );

  // Filtra gli incantesimi disponibili in base alla lista di incantesimi, al numero massimo di trucchetti e al livello massimo degli incantesimi
  const spellDisponibili = filtraSpellDisponibili(
    spells,
    listaIncantesimi,
    massimoTrucchetti,
    livelloMassimoSpell
  );
  const {
    trucchettiScelti,
    incantesimiScelti,
    cambiaTrucchetto,
    cambiaIncantesimo,
  } = useIncantesimi({
    spellDisponibili,
    massimoTrucchetti,
    massimoIncantesimiPreparati,
    trucchettiScelti: personaggio?.trucchettiScelti ?? [],
    incantesimiScelti: personaggio?.incantesimiScelti ?? [],
    onCambiaTrucchetti: cambiaTrucchettiPersonaggio,
    onCambiaIncantesimi: cambiaIncantesimiPersonaggio,
  });

  useEffect(() => {
    if (!personaggio) {
      return;
    }

    const idDisponibili = new Set(
      spellDisponibili.map((spell) => spell.id),
    );

    const trucchettiValidi = personaggio.trucchettiScelti.filter(
      (id) => idDisponibili.has(id),
    );

    const incantesimiValidi = personaggio.incantesimiScelti.filter(
      (id) => idDisponibili.has(id),
    );

    const trucchettiInvariati =
      trucchettiValidi.length === personaggio.trucchettiScelti.length;
    const incantesimiInvariati =
      incantesimiValidi.length === personaggio.incantesimiScelti.length;

    if (trucchettiInvariati && incantesimiInvariati) {
      return;
    }

    setPersonaggio((precedente) =>
      precedente
        ? {
          ...precedente,
          trucchettiScelti: trucchettiValidi,
          incantesimiScelti: incantesimiValidi,
        }
        : precedente,
    );
  }, [
    personaggio,
    listaIncantesimi,
    massimoTrucchetti,
    livelloMassimoSpell,
  ]);

  // Hook personalizzato per gestire i punti risorsa della classe
  const {
    puntiRisorsaSpesi,
    cambiaPuntiRisorsaSpesi,
  } = useRisorseClasse({
    puntiRisorsaSpesi: personaggio?.puntiRisorsaSpesi ?? 0,
    onCambiaPuntiRisorsaSpesi: cambiaPuntiRisorsaSpesiPersonaggio,
  });

  // RENDERING DEL SITO, visualizzazione lista personaggi salvati
  if (vista.nome === "lista") {
    return (
      <ListaPersonaggiSalvati
        personaggi={personaggiSalvati}
        onApri={apriPersonaggioSalvato}
        onElimina={eliminaPersonaggio}
        onNuovoPersonaggio={creaNuovoPersonaggio}
      />
    );
  }

  /////// RENDERING DEL SITO, Creazione personaggi qua ///////
  if (vista.nome === "creazione") {
    return (
      <CreaPersonaggio
        bozza={bozza}
        dispatchBozza={dispatchBozza}
        cambiaCaratteristica={cambiaCaratteristica}
        creaPersonaggio={creaPersonaggio}
        caricaPersonaggioDiProva={caricaPersonaggioDiProva}
        erroriForm={erroriForm}
      />
    );
  }

  // RENDERING DEL SITO, visualizzazione personaggio creato
  if (!personaggio) {
    return (
      <ListaPersonaggiSalvati
        personaggi={personaggiSalvati}
        onApri={apriPersonaggioSalvato}
        onElimina={eliminaPersonaggio}
        onNuovoPersonaggio={creaNuovoPersonaggio}
      />
    );
  }

  // I dati ufficiali del personaggio creato
  const classeScheda = classi.find(
    (classe) => classe.id === personaggio.classeId,
  );

  const razzaScheda = razze.find(
    (razza) => razza.id === personaggio.razzaId,
  );

  const sottorazzaScheda = razzaScheda?.sottorazze.find(
    (sottorazza) => sottorazza.id === personaggio.sottorazzaId,
  );

  const backgroundScheda = backgrounds.find(
    (background) => background.id === personaggio.backgroundId,
  );

  const sottoclassiScheda = sottoclassi.filter(
    (sottoclasse) => sottoclasse.classeId === personaggio.classeId,
  );

  const sottoclasseScheda = sottoclassiScheda.find(
    (sottoclasse) => sottoclasse.id === personaggio.sottoclasseId,
  );

  // Estrae il punteggio di Costituzione dalle caratteristiche del personaggio
  const statistiche = calcolaStatisticheDerivate({
    caratteristicheFinali: personaggio.caratteristiche,
    classe: classeScheda,
    livello: personaggio.livello,
  });

  const puntiFeritaMassimi = statistiche.puntiFeritaMassimi;
  const classeArmatura = statistiche.classeArmatura;

  // Funzione per resettare la bozza del personaggio e tornare alla fase di creazione
  function nuovoPersonaggio() {
    tornaAllaLista();
  }

  /////// RENDERING DEL SITO, visualizzazione personaggio creato ///////
  return (
    <SchedaPersonaggio
      nome={personaggio.nome}
      livello={personaggio.livello}
      onSaliDiLivello={() =>
        setPersonaggio((precedente) =>
          precedente
            ? {
              ...precedente,
              livello: precedente.livello + 1,
            }
            : precedente,
        )
      } bonusCompetenza={statistiche.bonusCompetenza}
      nomeClasse={classeScheda?.nome}
      dadoVita={classeScheda?.dadoVita}
      puntiFeritaMassimi={puntiFeritaMassimi}
      nomeRazza={razzaScheda?.nome}
      nomeSottorazza={sottorazzaScheda?.nome}
      tipoCreatura={razzaScheda?.tipoCreatura}
      velocita={razzaScheda?.velocita}
      taglia={personaggio.taglia}
      primaLinguaId={personaggio.lingue[1]}
      secondaLinguaId={personaggio.lingue[2]}
      caratteristiche={personaggio.caratteristiche}
      modificatore={modificatore}
      classeArmatura={classeArmatura}
      abilitaCompetenti={personaggio.abilitaCompetenti}
      onCambiaCompetenzaAbilita={cambiaCompetenzaAbilita}
      tiriSalvezzaCompetenti={classeScheda?.tiriSalvezza ?? []}
      nomeBackground={backgroundScheda?.nome}
      descrizioneBackground={backgroundScheda?.descrizione}
      abilitaBackground={backgroundScheda?.abilita ?? []}
      slotMassimi={slotMassimi}
      slotConsumati={slotConsumati}
      onCambiaSlot={cambiaSlot}
      sottoclasseId={personaggio.sottoclasseId}
      onCambiaSottoclasse={(nuovaSottoclasseId) =>
        setPersonaggio((precedente) =>
          precedente
            ? {
              ...precedente,
              sottoclasseId: nuovaSottoclasseId,
            }
            : precedente,
        )
      }
      sottoclassiDisponibili={sottoclassiScheda}
      massimoTrucchetti={massimoTrucchetti}
      massimoIncantesimiPreparati={massimoIncantesimiPreparati}
      spellDisponibili={spellDisponibili}
      trucchettiScelti={trucchettiScelti}
      incantesimiScelti={incantesimiScelti}
      onCambiaTrucchetto={cambiaTrucchetto}
      onCambiaIncantesimo={cambiaIncantesimo}
      risorsaClasseNome={risorsaClasse?.nome}
      risorsaClasseId={risorsaClasse?.id}
      puntiRisorsaMassimi={puntiRisorsaMassimi}
      puntiRisorsaSpesi={puntiRisorsaSpesi}
      onCambiaPuntiRisorsaSpesi={cambiaPuntiRisorsaSpesi}
      livelloSlotRisorsa={livelloSlotRisorsa}
      onNuovoPersonaggio={nuovoPersonaggio}
    />
  );
}

export default App;