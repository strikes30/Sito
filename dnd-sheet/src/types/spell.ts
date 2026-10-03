export type Spell = {
    id: string;
    name: string;
    level: number;
    school: string;
    classes: string[];
    actionType: string;
    concentration: boolean;
    ritual: boolean;
    range: string;
    components: string[];
    material?: string;
    duration: string;
    description: string;
    higherLevelSlot?: string;
};