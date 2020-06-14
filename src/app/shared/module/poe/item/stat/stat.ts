export interface Stat {
    id?: string;
    mod?: string;
    negated?: boolean;
    text: {
        [language: number]: {
            [predicate: string]: string;
        };
    };
    option?: boolean;
}

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

export interface StatMap {
    [id: string]: Stat;
}
