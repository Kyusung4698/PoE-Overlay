import { Currency } from '../currency/currency.type';

export interface Item {
    rarity?: ItemRarity;
    name?: string;
    type?: string;
    nameType?: string;
    flags?: ItemFlags;
    level?: number;
    sockets?: string;
    properties?: ItemProperty[];
    requirements?: ItemRequirements;
    secondaryDescription?: string;
    implicits?: ItemMod[];
    explicits?: ItemMod[];
    description?: string;
    note?: string;
}

export enum ItemRarity {
    Normal = 'normal',
    Magic = 'magic',
    Rare = 'rare',
    Unique = 'unique',
    Currency = 'currency',
    Gem = 'gem',
    DivinationCard = 'divinationcard'
}

export interface ItemFlags {
    unique?: boolean;
}

export interface ItemProperty {
    text: string;
    value?: string;
    augmented?: boolean;
}

export interface ItemMod {
    text: string;
}

export interface ItemRequirements {
    level?: number;
    int?: number;
    str?: number;
    dex?: number;
}

export interface ItemsMap {
    label: string;
    items: Item[];
}

export type EvaluateItem = Item & {
    originalCurrency: Currency;
    originalCurrencyAmount: number;
    targetCurrency: Currency;
    targetCurrencyAmount: number;
};

export interface ItemSearchEvaluateResult {
    items: EvaluateItem[];
    targetCurrency?: Currency;
    targetCurrencyAvg?: number;
}

export type SearchItem = Item & {
    currency: Currency;
    currencyAmount: number;
};

export interface ItemSearchResult {
    items: SearchItem[];
    url: string;
}


export interface ExportedItem {
    sections: Section[];
}

export interface Section {
    content: string;
    lines: string[];
}

export interface ItemSectionParserService {
    optional: boolean;
    parse(item: ExportedItem, target: Item): Section;
}
