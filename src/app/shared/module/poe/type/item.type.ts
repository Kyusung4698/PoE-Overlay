import { Currency } from './currency.type';
import { Language } from './language.type';

export interface Item {
    language: Language;
    rarity?: ItemRarity;
    name?: string;
    type?: string;
    nameType?: string;
    flags?: ItemFlags;
    level?: number;
    sockets?: string;
    properties?: ItemProperties;
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

export interface ItemProperties {
    weaponPhysicalDamage?: ItemProperty;
    weaponElementalDamage?: ItemProperty;
    weaponChaosDamage?: ItemProperty;
    weaponCriticalStrikeChance?: ItemProperty;
    weaponAttacksPerSecond?: ItemProperty;
    weaponRange?: ItemProperty;
    shieldBlockChance?: ItemProperty;
    armourArmour?: ItemProperty;
    armourEvasionRating?: ItemProperty;
    armourEnergyShield?: ItemProperty;
    additionals?: ItemProperty[];
}

export interface ItemProperty {
    value: string;
    augmented: boolean;
}

export interface ItemAdditionalProperty extends ItemProperty {
    text: string;
}

export interface ItemMod {
    key: string;
    predicate: string;
    values: string[];
    crafted?: boolean;
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
