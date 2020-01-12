export enum StatType {
    Pseudo = 'pseudo',
    Explicit = 'explicit',
    Implicit = 'implicit',
    Crafted = 'crafted',
    Fractured = 'fractured',
    Enchant = 'enchant',
    Veiled = 'veiled',
    Monster = 'monster',
    Delve = 'delve'
}

export interface Stat {
    id?: string;
    mod?: string;
    text: {
        [language: number]: string;
    };
}
