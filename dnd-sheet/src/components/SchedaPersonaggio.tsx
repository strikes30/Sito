// import { useState } from "react";
import SezioneInformazioniBase from "./scheda/SezioneInformazioniBase";
import SezioneRisorseClasse from "./scheda/SezioneRisorseClasse";
import SezioneIncantesimi from "./scheda/SezioneIncantesimi";
import SezioneSlotIncantesimo from "./scheda/SezioneSlotIncantesimo";
import SezioneCaratteristiche from "./scheda/SezioneCaratteristiche";
import type { Caratteristica } from "../types/personaggio";
import type { CompetenzaArmatura } from "../types/dnd";


import type { Spell } from "../types/spell";

type Props = {
    // Dati generali del personaggio
    nome: string;
    livello: number;
    onSaliDiLivello: () => void;
    bonusCompetenza: number;

    // Dati della classe e della sottoclasse
    nomeClasse: string | undefined;
    competenzeArmatura: CompetenzaArmatura[];
    dadoVita: number | undefined;
    puntiFeritaMassimi: number | null;

    sottoclasseId: string;
    onCambiaSottoclasse: (id: string) => void;
    sottoclassiDisponibili: {
        id: string;
        nome: string;
        classeId: string;
    }[];

    // Dati della razza
    nomeRazza: string | undefined;
    nomeSottorazza: string | undefined;
    tipoCreatura: string | undefined;
    taglia: string;
    velocita: number | undefined;

    // Lingue conosciute
    primaLinguaId: string;
    secondaLinguaId: string;

    // Caratteristiche e modificatori
    caratteristiche: Record<Caratteristica, number | null>;
    modificatore: (punteggio: number) => number;

    classeArmatura: number | null;

    abilitaCompetenti: string[];
    onCambiaCompetenzaAbilita: (id: string) => void;

    tiriSalvezzaCompetenti: string[];

    // Background
    nomeBackground: string | undefined;
    descrizioneBackground: string | undefined;
    abilitaBackground: string[];

    // Slot incantesimo o altre risorse della classe (come punti Ki del Monk o punti Patto del Warlock)
    slotMassimi: number[];
    risorsaClasseNome?: string;
    risorsaClasseId?: string;
    puntiRisorsaMassimi: number;
    puntiRisorsaSpesi: number;
    livelloSlotRisorsa: number;
    onCambiaPuntiRisorsaSpesi: (nuovoValore: number) => void;
    slotConsumati: Set<string>;
    onCambiaSlot: (id: string) => void;

    // Incantesimi e trucchetti
    massimoTrucchetti: number;
    massimoIncantesimiPreparati: number;

    // Lista di tutti gli incantesimi disponibili per la classe del personaggio
    spellDisponibili: Spell[];
    trucchettiScelti: string[];
    incantesimiScelti: string[];
    onCambiaTrucchetto: (id: string) => void;
    onCambiaIncantesimo: (id: string) => void;

    // Funzione per creare un nuovo personaggio, resettando la scheda
    onNuovoPersonaggio: () => void;
};

// Da qui inizia il componente principale della scheda del personaggio
function SchedaPersonaggio({
    nome,
    livello,
    onSaliDiLivello,
    bonusCompetenza,
    nomeClasse,
    competenzeArmatura,
    sottoclasseId,
    onCambiaSottoclasse,
    sottoclassiDisponibili,
    dadoVita,
    puntiFeritaMassimi,
    nomeRazza,
    nomeSottorazza,
    tipoCreatura,
    taglia,
    velocita,
    primaLinguaId,
    secondaLinguaId,
    caratteristiche,
    modificatore,
    classeArmatura,
    abilitaCompetenti,
    onCambiaCompetenzaAbilita,
    tiriSalvezzaCompetenti,
    nomeBackground,
    descrizioneBackground,
    abilitaBackground,
    slotMassimi,
    massimoTrucchetti,
    massimoIncantesimiPreparati,
    spellDisponibili,
    trucchettiScelti,
    incantesimiScelti,
    onCambiaTrucchetto,
    onCambiaIncantesimo,
    risorsaClasseNome,
    risorsaClasseId,
    puntiRisorsaMassimi,
    puntiRisorsaSpesi,
    onCambiaPuntiRisorsaSpesi,
    livelloSlotRisorsa,
    slotConsumati,
    onCambiaSlot,
    onNuovoPersonaggio,
    
}: Props) {

    {/* Rendering della scheda del personaggio */ }
    return (
        <main>
            
            <button type="button" onClick={onNuovoPersonaggio}>
                Crea un nuovo personaggio
            </button>

            <SezioneInformazioniBase
                nome={nome}
                livello={livello}
                onSaliDiLivello={onSaliDiLivello}
                bonusCompetenza={bonusCompetenza}
                nomeClasse={nomeClasse}
                competenzeArmatura={competenzeArmatura}
                sottoclasseId={sottoclasseId}
                onCambiaSottoclasse={onCambiaSottoclasse}
                sottoclassiDisponibili={sottoclassiDisponibili}
                dadoVita={dadoVita}
                puntiFeritaMassimi={puntiFeritaMassimi}
                nomeRazza={nomeRazza}
                nomeSottorazza={nomeSottorazza}
                tipoCreatura={tipoCreatura}
                taglia={taglia}
                velocita={velocita}
                primaLinguaId={primaLinguaId}
                secondaLinguaId={secondaLinguaId}
                classeArmatura={classeArmatura}
                nomeBackground={nomeBackground}
                descrizioneBackground={descrizioneBackground}
            />

            {/* Slot incantesimo */}
            <SezioneSlotIncantesimo
                slotMassimi={slotMassimi}
                slotConsumati={slotConsumati}
                onCambiaSlot={onCambiaSlot}
            />
            {spellDisponibili.length > 0 && (
                <SezioneIncantesimi
                    spellDisponibili={spellDisponibili}
                    trucchettiScelti={trucchettiScelti}
                    incantesimiScelti={incantesimiScelti}
                    massimoTrucchetti={massimoTrucchetti}
                    massimoIncantesimiPreparati={massimoIncantesimiPreparati}
                    onCambiaTrucchetto={onCambiaTrucchetto}
                    onCambiaIncantesimo={onCambiaIncantesimo}
                />
            )}

            {/* Risorse della classe (come punti Ki del Monk o punti Patto del Warlock) */}
            <SezioneRisorseClasse
                id={risorsaClasseId}
                nome={risorsaClasseNome}
                massimi={puntiRisorsaMassimi}
                spesi={puntiRisorsaSpesi}
                livelloSlot={livelloSlotRisorsa}
                onCambiaSpesi={onCambiaPuntiRisorsaSpesi}
            />

            {/* Caratteristiche */}
            <SezioneCaratteristiche
                caratteristiche={caratteristiche}
                modificatore={modificatore}
                bonusCompetenza={bonusCompetenza}
                tiriSalvezzaCompetenti={tiriSalvezzaCompetenti}
                abilitaCompetenti={abilitaCompetenti}
                abilitaBackground={abilitaBackground}
                onCambiaCompetenzaAbilita={onCambiaCompetenzaAbilita}
            />
        </main>
    );
}

export default SchedaPersonaggio;