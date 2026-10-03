import { useState } from "react";
import { useReducer } from "react";

import { bozzaPersonaggioReducer } from "./engine/bozzaPersonaggioReducer";
import { bozzaIniziale } from "./types/bozzaPersonaggio";

import CreaPersonaggio from "./components/CreaPersonaggio";
import SchedaPersonaggio from "./components/SchedaPersonaggio";
import backgrounds from "./data/background.json";
import progressioneSlot from "./data/progressionSlot.json";
import sottoclassi from "./data/sottoclassi.json";
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
  // nomiCaratteristiche,
  type Caratteristica,
} from "./types/personaggio";

import {
  modificatore,
} from "./utils/calcoliPersonaggio";

import { calcolaStatisticheDerivate } from "./utils/calcolaStatisticheDerivate";

import { calcolaCaratteristicheFinali } from "./utils/calcolaCaratteristicheFinali";

import { validaBozzaPersonaggio } from "./engine/validaBozzaPersonaggio";

import classi from "./data/classi.json";
import razze from "./data/razze.json";
import lingue from "./data/lingue.json";

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

  // Stato per la bozza del personaggio in fase di creazione
  const [bozza, dispatchBozza] = useReducer(
    bozzaPersonaggioReducer,
    bozzaIniziale,
  );

  const [personaggioCreato, setPersonaggioCreato] = useState(false);   // Stato per verificare se il personaggio è stato creato
  const [livello, setLivello] = useState(1);  // Livello del personaggio
  const [erroriForm, setErroriForm] = useState<string[]>([]); // Stato per gli errori di validazione del form

  // Filtra le sottoclassi disponibili in base alla classe selezionata
  const sottoclassiDisponibili = sottoclassi.filter(
    (voce) => voce.classeId === bozza.classeId
  );

  const sottoclasseSelezionata = sottoclassiDisponibili.find(
    (voce) => voce.id === bozza.sottoclasseId
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

  // Cerca nel JSON la classe che ha l'ID scelto dall'utente
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

    dispatchBozza({
      type: "CAMBIA_CAMPO",
      campo: "nome",
      valore: bozza.nome.trim(),
    });

    setPersonaggioCreato(true);
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

  // Stato per le abilità competenti del personaggio
  const [abilitaCompetenti, setAbilitaCompetenti] = useState<string[]>([]);

  // Funzione per cambiare lo stato di competenza di un'abilità
  function cambiaCompetenzaAbilita(id: string) {
    setAbilitaCompetenti((precedenti) =>
      precedenti.includes(id)
        ? precedenti.filter((abilitaId) => abilitaId !== id)
        : [...precedenti, id],
    );
  }

  /////////// CALCOLO DEI TRUCCHETTI E DEGLI INCANTESIMI PREPARATI //////////

  // Hook personalizzato per gestire gli slot degli incantesimi
  const { slotConsumati, cambiaSlot } = useSlotIncantesimi();

  // Cerca nel JSON la classe che ha l'ID scelto dall'utente
  const classeSelezionata = classi.find(
    (voce) => voce.id === bozza.classeId
  );

  // Determina il tipo di progressione degli slot in base alla classe selezionata
  const tipoProgressione =
    livello >= 3 && sottoclasseSelezionata?.progressioneSlot
      ? sottoclasseSelezionata.progressioneSlot
      : classeSelezionata?.progressioneSlot;

  const slotMassimi: number[] =
    tipoProgressione === "completa" ||
      tipoProgressione === "metà" ||
      tipoProgressione === "terzo"
      ? progressioneSlot[tipoProgressione][livello - 1] ?? []
      : [];

  // Determina la risorsa della classe selezionata, se presente (tipo il Monk ha i punti Ki, il Warlock ha i punti Patto, ecc.)
  const risorsaClasse = classeSelezionata?.risorsaClasse;

  const puntiRisorsaMassimi = calcolaPuntiRisorsaMassimi(
    risorsaClasse,
    livello
  );

  const livelloSlotRisorsa = calcolaLivelloSlotRisorsa(
    risorsaClasse,
    livello
  );

  // Determina le regole degli incantesimi in base alla classe o sottoclasse selezionata
  const regoleClasse = progressioniIncantesimi[bozza.classeId];

  // Determina le regole degli incantesimi in base alla sottoclasse selezionata, se il livello è almeno 3
  const regoleSottoclasse =
    livello >= 3 && sottoclasseSelezionata
      ? progressioniIncantesimi[sottoclasseSelezionata.id]
      : undefined;

  // Determina le regole degli incantesimi da usare, dando priorità alla sottoclasse se presente
  const regoleIncantesimi = regoleClasse ?? regoleSottoclasse;

  const massimoTrucchetti =
    regoleIncantesimi?.trucchetti[livello - 1] ?? 0;

  const massimoIncantesimiPreparati =
    regoleIncantesimi?.preparati[livello - 1] ?? 0;

  // Determina la lista di incantesimi disponibili in base alla classe o sottoclasse selezionata
  const listaIncantesimi =
    regoleIncantesimi?.listaIncantesimi ?? bozza.classeId;

  const livelloMassimoSpell = calcolaLivelloMassimoIncantesimo(
    bozza.classeId,
    slotMassimi,
    classeSelezionata?.risorsaClasse?.livelloSlotPerLivello?.[livello - 1]
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
  });

  // Hook personalizzato per gestire i punti risorsa della classe
  const {
    puntiRisorsaSpesi,
    cambiaPuntiRisorsaSpesi,
  } = useRisorseClasse();

  /////// RENDERING DEL SITO, Creazione personaggi qua ///////
  if (!personaggioCreato) {
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

  // Estrae il punteggio di Costituzione dalle caratteristiche del personaggio
  const statistiche = calcolaStatisticheDerivate({
    caratteristicheFinali,
    classe: classeSelezionata,
    livello,
  });

  const puntiFeritaMassimi = statistiche.puntiFeritaMassimi;
  const classeArmatura = statistiche.classeArmatura;

  /////// RENDERING DEL SITO, visualizzazione personaggio creato ///////
  return (
    <SchedaPersonaggio
      nome={bozza.nome}
      livello={livello}
      onSaliDiLivello={() => setLivello((precedente) => precedente + 1)}
      bonusCompetenza={statistiche.bonusCompetenza}
      nomeClasse={classeSelezionata?.nome}
      dadoVita={classeSelezionata?.dadoVita}
      puntiFeritaMassimi={puntiFeritaMassimi}
      nomeRazza={razzaSelezionata?.nome}
      nomeSottorazza={sottorazzaSelezionata?.nome}
      tipoCreatura={razzaSelezionata?.tipoCreatura}
      taglia={bozza.taglia}
      velocita={razzaSelezionata?.velocita}
      primaLinguaId={bozza.primaLinguaId}
      secondaLinguaId={bozza.secondaLinguaId}
      caratteristiche={caratteristicheFinali}
      modificatore={modificatore}
      classeArmatura={classeArmatura}
      abilitaCompetenti={abilitaCompetenti}
      onCambiaCompetenzaAbilita={cambiaCompetenzaAbilita}
      tiriSalvezzaCompetenti={classeSelezionata?.tiriSalvezza ?? []}
      nomeBackground={backgroundSelezionato?.nome}
      descrizioneBackground={backgroundSelezionato?.descrizione}
      abilitaBackground={backgroundSelezionato?.abilita ?? []}
      slotMassimi={slotMassimi}
      slotConsumati={slotConsumati}
      onCambiaSlot={cambiaSlot}
      sottoclasseId={bozza.sottoclasseId}
      onCambiaSottoclasse={(nuovaSottoclasseId) =>
        dispatchBozza({
          type: "CAMBIA_CAMPO",
          campo: "sottoclasseId",
          valore: nuovaSottoclasseId,
        })
      }
      sottoclassiDisponibili={sottoclassiDisponibili}
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
    />
  );
}

export default App;