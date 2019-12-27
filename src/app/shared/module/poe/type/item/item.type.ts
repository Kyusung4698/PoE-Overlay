import { Currency } from "../currency/currency.type"

export type Item = {
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

export type ItemFlags = {
    unique?: boolean;
}

export type ItemProperty = {
    text: string;
    value?: string;
    augmented?: boolean;
}

export type ItemMod = {
    text: string;
}

export type ItemRequirements = {
    level?: number;
    int?: number;
    str?: number;
    dex?: number;
}

export type ItemsMap = {
    label: string;
    items: Item[];
}

export type EvaluateItem = Item & {
    originalCurrency: Currency;
    originalCurrencyAmount: number;
    targetCurrency: Currency;
    targetCurrencyAmount: number;
}

export type ItemSearchEvaluateResult = {
    items: EvaluateItem[];
    targetCurrency?: Currency;
    targetCurrencyAvg?: number;
}

export type SearchItem = Item & {
    currency: Currency;
    currencyAmount: number;
}

export type ItemSearchResult = {
    items: SearchItem[];
}


export type ExportedItem = {
    sections: Section[];
}

export type Section = {
    content: string;
    lines: string[];
}

export type ItemSectionParserService = {
    parse(item: ExportedItem, target: Item): Section;
    optional: boolean;
}