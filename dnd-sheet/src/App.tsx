import { useState } from "react";
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
  nomiCaratteristiche,
  type Caratteristica,
} from "./types/personaggio";

import {
  modificatore,
  calcolaPuntiFerita,
  calcolaBonusCompetenza,
  calcolaClasseArmatura,
} from "./utils/calcoliPersonaggio";

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
  const [nome, setNome] = useState("");  // Nome del personaggio
  const [classe, setClasse] = useState("");  // Classe del personaggio
  const [sottoclasseId, setSottoclasseId] = useState("");  // Sottoclasse del personaggio
  const [razzaId, setRazzaId] = useState("");  // Razza del personaggio
  const [sottorazzaId, setSottorazzaId] = useState("");  // Sottorazza del personaggio
  const [taglia, setTaglia] = useState(""); // Taglia del personaggio
  const [personaggioCreato, setPersonaggioCreato] = useState(false);   // Stato per verificare se il personaggio è stato creato
  const [livello, setLivello] = useState(1);  // Livello del personaggio
  const [primaLinguaId, setPrimaLinguaId] = useState("");  // Prima lingua del personaggio
  const [secondaLinguaId, setSecondaLinguaId] = useState("");  // Seconda lingua del personaggio

  // Stato per le caratteristiche del personaggio, inizializzate a null
  const [caratteristiche, setCaratteristiche] = useState<
    Record<Caratteristica, number | null>
  >({
    Forza: null,
    Destrezza: null,
    Costituzione: null,
    Intelligenza: null,
    Saggezza: null,
    Carisma: null,
  });

  // Stato per il background del personaggio, inizializzato a una stringa vuota
  const [backgroundId, setBackgroundId] = useState("");

  // Filtra le sottoclassi disponibili in base alla classe selezionata
  const sottoclassiDisponibili = sottoclassi.filter(
    (voce) => voce.classeId === classe
  );

  const sottoclasseSelezionata = sottoclassiDisponibili.find(
    (voce) => voce.id === sottoclasseId
  );
  // Stato per la distribuzione dei bonus di caratteristica del background
  const [distribuzioneBackground, setDistribuzioneBackground] =
    useState<"" | "due" | "tre">("");
  const [caratteristicaPiuDue, setCaratteristicaPiuDue] = useState("");
  const [caratteristicaPiuUno, setCaratteristicaPiuUno] = useState("");

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
    setCaratteristiche((precedenti) => ({
      ...precedenti,
      [caratteristica]: nuovoValore,
    }));
  }

  // Cerca nel JSON la razza che ha l'ID scelto dall'utente
  const razzaSelezionata = razze.find(
    (razza) => razza.id === razzaId,
  );

  // Cerca nel JSON la sottorazza che ha l'ID scelto dall'utente
  const sottorazzaSelezionata = razzaSelezionata?.sottorazze.find(
    (sottorazza) => sottorazza.id === sottorazzaId,
  );

  // Cerca nel JSON la classe che ha l'ID scelto dall'utente
  const backgroundSelezionato = backgrounds.find(
    (background) => background.id === backgroundId,
  );

  // Calcola le caratteristiche finali del personaggio, tenendo conto dei bonus del background
  const caratteristicheFinali: Record<Caratteristica, number | null> =
    { ...caratteristiche };

  if (backgroundSelezionato) {
    for (const caratteristica of nomiCaratteristiche) {
      const punteggioIniziale = caratteristiche[caratteristica];

      if (punteggioIniziale === null) continue;

      const disponibile =
        backgroundSelezionato.caratteristicheDisponibili.includes(
          caratteristica,
        );

      if (!disponibile) continue;

      let aumento = 0;

      if (distribuzioneBackground === "tre") {
        aumento = 1;
      } else if (distribuzioneBackground === "due") {
        if (caratteristica === caratteristicaPiuDue) aumento = 2;
        if (caratteristica === caratteristicaPiuUno) aumento = 1;
      }

      caratteristicheFinali[caratteristica] =
        punteggioIniziale + aumento;
    }
  }

  // Funzione per creare il personaggio, con controlli di validità
  function creaPersonaggio(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();

    const nomePulito = nome.trim();
    if (nomePulito === "") return;

    if (
      nomiCaratteristiche.some(
        (caratteristica) => caratteristiche[caratteristica] === null,
      )
    ) {
      return;
    }

    if (!razzaSelezionata) return;
    if (!razzaSelezionata.taglie.includes(taglia)) return;
    if (
      razzaSelezionata.sottorazze.length > 0 &&
      !sottorazzaSelezionata
    ) {
      return;
    }

    if (
      primaLinguaId === secondaLinguaId ||
      !lingueIniziali.some((lingua) => lingua.id === primaLinguaId) ||
      !lingueIniziali.some((lingua) => lingua.id === secondaLinguaId)
    ) {
      return;
    }

    if (!backgroundSelezionato) return;

    const caratteristicheDisponibili =
      backgroundSelezionato.caratteristicheDisponibili;

    if (distribuzioneBackground === "due") {
      if (
        !caratteristicheDisponibili.includes(caratteristicaPiuDue) ||
        !caratteristicheDisponibili.includes(caratteristicaPiuUno) ||
        caratteristicaPiuDue === caratteristicaPiuUno
      ) {
        return;
      }
    } else if (distribuzioneBackground === "tre") {
      if (caratteristicheDisponibili.length !== 3) return;
    } else {
      return;
    }

    setNome(nomePulito);
    setPersonaggioCreato(true);
  }

  // Funzione per caricare un personaggio di prova, utile per testare l'applicazione
  function caricaPersonaggioDiProva() {
    setNome("Personaggio");
    setClasse("warlock");
    setRazzaId("umano");

    setTaglia("Media");

    // Sostituisci questi id con quelli presenti davvero in lingue.json.
    setPrimaLinguaId("elfico");
    setSecondaLinguaId("nanico");

    // Sostituisci con un id esistente in background.json.
    setBackgroundId("accolito");

    setDistribuzioneBackground("tre");

    setCaratteristiche({
      Forza: 10,
      Destrezza: 15,
      Costituzione: 14,
      Intelligenza: 13,
      Saggezza: 12,
      Carisma: 8,
    });

    // IMPORTANTE:
    // Non mettere setPersonaggioCreato(true) qui.
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
    (voce) => voce.id === classe
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
  const regoleClasse = progressioniIncantesimi[classe];

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
    regoleIncantesimi?.listaIncantesimi ?? classe;

  const livelloMassimoSpell = calcolaLivelloMassimoIncantesimo(
    classe,
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
        nome={nome}
        setNome={setNome}
        classe={classe}
        setClasse={setClasse}
        razzaId={razzaId}
        setRazzaId={setRazzaId}
        sottorazzaId={sottorazzaId}
        setSottorazzaId={setSottorazzaId}
        taglia={taglia}
        setTaglia={setTaglia}
        primaLinguaId={primaLinguaId}
        setPrimaLinguaId={setPrimaLinguaId}
        secondaLinguaId={secondaLinguaId}
        setSecondaLinguaId={setSecondaLinguaId}
        caratteristiche={caratteristiche}
        cambiaCaratteristica={cambiaCaratteristica}
        backgroundId={backgroundId}
        setBackgroundId={setBackgroundId}
        creaPersonaggio={creaPersonaggio}
        distribuzioneBackground={distribuzioneBackground}
        setDistribuzioneBackground={setDistribuzioneBackground}
        caratteristicaPiuDue={caratteristicaPiuDue}
        setCaratteristicaPiuDue={setCaratteristicaPiuDue}
        caratteristicaPiuUno={caratteristicaPiuUno}
        setCaratteristicaPiuUno={setCaratteristicaPiuUno}
        caricaPersonaggioDiProva={caricaPersonaggioDiProva}
      />
    );
  }

  // Estrae il punteggio di Costituzione dalle caratteristiche del personaggio
  const costituzione = caratteristicheFinali.Costituzione;

  const puntiFeritaMassimi =
    classeSelezionata && costituzione !== null
      ? calcolaPuntiFerita(
        classeSelezionata.dadoVita,
        livello,
        modificatore(costituzione),
      )
      : null;

  const classeArmatura =
    caratteristicheFinali.Destrezza !== null
      ? calcolaClasseArmatura(caratteristicheFinali.Destrezza)
      : null;

  /////// RENDERING DEL SITO, visualizzazione personaggio creato ///////
  return (
    <SchedaPersonaggio
      nome={nome}
      livello={livello}
      onSaliDiLivello={() => setLivello((precedente) => precedente + 1)}
      bonusCompetenza={calcolaBonusCompetenza(livello)}
      nomeClasse={classeSelezionata?.nome}
      dadoVita={classeSelezionata?.dadoVita}
      puntiFeritaMassimi={puntiFeritaMassimi}
      nomeRazza={razzaSelezionata?.nome}
      nomeSottorazza={sottorazzaSelezionata?.nome}
      tipoCreatura={razzaSelezionata?.tipoCreatura}
      taglia={taglia}
      velocita={razzaSelezionata?.velocita}
      primaLinguaId={primaLinguaId}
      secondaLinguaId={secondaLinguaId}
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
      sottoclasseId={sottoclasseId}
      onCambiaSottoclasse={setSottoclasseId}
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