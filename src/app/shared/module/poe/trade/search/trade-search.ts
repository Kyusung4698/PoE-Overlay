import { Language, TradeSearchHttpRequest } from '@data/poe/schema';

export const TYPES = {
    weapon: 'Any Weapon',
    'weapon.one': 'One-Handed Weapon',
    'weapon.onemelee': 'One-Handed Melee Weapon',
    'weapon.twomelee': 'Two-Handed Melee Weapon',
    'weapon.bow': 'Bow',
    'weapon.claw': 'Claw',
    'weapon.dagger': 'Any Dagger',
    'weapon.runedagger': 'Rune Dagger',
    'weapon.oneaxe': 'One-Handed Axe',
    'weapon.onemac': 'One-Handed Mac',
    'weapon.onesword': 'One-Handed Sword',
    'weapon.sceptre': 'Sceptre',
    'weapon.staff': 'Any Staff',
    'weapon.warstaff': 'Warstaff',
    'weapon.twoaxe': 'Two-Handed Axe',
    'weapon.twomac': 'Two-Handed Mac',
    'weapon.twosword': 'Two-Handed Sword',
    'weapon.wand': 'Wand',
    'weapon.rod': 'Fishing Rod',
    armour: 'Any Armour',
    'armour.chest': 'Body Armour',
    'armour.boots': 'Boots',
    'armour.gloves': 'Gloves',
    'armour.helmet': 'Helmet',
    'armour.shield': 'Shield',
    'armour.quiver': 'Quiver',
    accessory: 'Any Accessory',
    'accessory.amulet': 'Amulet',
    'accessory.belt': 'Belt',
    'accessory.ring': 'Ring',
    gem: 'Any Gem',
    'gem.activegem': 'Skill Gem',
    'gem.supportgem': 'Support Gem',
    'gem.supportgemplus': 'Awakened Support Gem',
    jewel: 'Any Jewel',
    'jewel.base': 'Base Jewel',
    'jewel.abyss': 'Abyss Jewel',
    'jewel.cluster': 'Cluster Jewel',
    flask: 'Flask',
    map: 'Map',
    'map.fragment': 'Map Fragment',
    'map.scarab': 'Scarab',
    watchstone: 'Watchstone',
    leaguestone: 'Leaguestone',
    prophecy: 'Prophecy',
    card: 'Card',
    'monster.beast': 'Captured Beast',
    'monster.sample': 'Metamorph Sample',
    currency: 'Any Currency',
    'currency.piece': 'Unique Fragment',
    'currency.resonator': 'Resonator',
    'currency.fossil': 'Fossil',
    'currency.incubator': 'Incubator',
};

export const RARITIES = {
    normal: 'Normal',
    magic: 'Magic',
    rare: 'Rare',
    unique: 'Unique',
    uniquefoil: 'Unique (Relic)',
    nonunique: 'Any Non-Unique',
};

export interface TradeSearchResponse {
    id: string;
    url: string;
    language: Language;
    ids: string[];
    total: number;
}

export type TradeSearchRequest = TradeSearchHttpRequest;
