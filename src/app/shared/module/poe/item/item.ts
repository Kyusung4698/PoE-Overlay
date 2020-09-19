import { ItemCategory } from './base-item-type';
import { StatType } from './stat';

export interface Item {
    content?: string;
    rarity?: ItemRarity;
    level?: ItemValue;
    category?: ItemCategory;
    name?: string;
    nameId?: string;
    type?: string;
    typeId?: string;
    icon?: string;
    width?: number;
    height?: number;
    corrupted?: boolean;
    veiled?: boolean;
    unidentified?: boolean;
    influences?: ItemInfluences;
    sockets?: ItemSocket[];
    properties?: ItemProperties;
    damage?: ItemWeaponDamage;
    requirements?: ItemRequirements;
    note?: string;
    stats?: ItemStat[];
}

export enum ItemSocketColor {
    Red = 'R',
    Green = 'G',
    Blue = 'B',
    White = 'W',
    Abyss = 'A'
}

export interface ItemSocket {
    color: ItemSocketColor;
    linked: boolean;
}

export interface ItemProperties {
    weaponPhysicalDamage?: ItemValue;
    weaponElementalDamage?: ItemValue[];
    weaponChaosDamage?: ItemValue;
    weaponCriticalStrikeChance?: ItemValue;
    weaponAttacksPerSecond?: ItemValue;
    weaponRange?: ItemValue;
    shieldBlockChance?: ItemValue;
    armourArmour?: ItemValue;
    armourEvasionRating?: ItemValue;
    armourEnergyShield?: ItemValue;
    stackSize?: ItemValue;
    gemLevel?: ItemValue;
    quality?: ItemValue;
    qualityType?: ItemQualityType;
    gemExperience?: ItemValue;
    mapTier?: ItemValue;
    mapQuantity?: ItemValue;
    mapRarity?: ItemValue;
    mapPacksize?: ItemValue;
    heistAreaLevel?: ItemValue;
    heistWingsRevealed?: ItemValue;
    heistEscapeRoutesRevealed?: ItemValue;
    heistSecretRewardRoomsRevealed?: ItemValue;
    heistReinforcements?: ItemValue;
}

export enum ItemQualityType {
    Default = 0,
    ElementalDamage = 1,
    CasterModifiers = 2,
    AttackModifiers = 3,
    DefenceModifiers = 4,
    LifeAndManaModifiers = 5,
    ResistanceModifiers = 6,
    AttributeModifiers = 7,
}

export interface ItemValue {
    text: string;
    value: number;
    augmented?: boolean;
    min?: number;
    max?: number;
    tier?: ItemValueTier;
}

export interface ItemValueTier {
    min: number;
    max: number;
}

export enum ItemRarity {
    Normal = 'normal',
    Magic = 'magic',
    Rare = 'rare',
    Unique = 'unique',
    UniqueRelic = 'uniquefoil',
    NonUnique = 'nonunique',
    Currency = 'currency',
    Gem = 'gem',
    DivinationCard = 'divinationcard',
}

export interface ItemInfluences {
    shaper?: boolean;
    crusader?: boolean;
    hunter?: boolean;
    elder?: boolean;
    redeemer?: boolean;
    warlord?: boolean;
}

export interface ItemRequirements {
    level?: number;
    int?: number;
    str?: number;
    dex?: number;
}

export interface ItemStat {
    id: string;
    predicate: string;
    tradeId: string;
    mod: string;
    negated: boolean;
    type: StatType;
    values: ItemValue[];
    option: boolean;
}

export interface ItemWeaponDamage {
    dps?: ItemValue;
    edps?: ItemValue;
    pdps?: ItemValue;
}
