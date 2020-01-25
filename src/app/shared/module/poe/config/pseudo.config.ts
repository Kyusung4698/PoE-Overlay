import { Item, ItemQualityType } from '../type';

export enum ModifierType {
    Addition,
    Addition5Every10,
    Addition1Every2,
    MinimumRequired,
}

export interface Modifier {
    id: string;
    type: ModifierType;
}

export interface PseudoModifier {
    mods?: Modifier[];
    prop?: (item: Item) => string;
    count?: number;
}

export const PSEUDO_MODIFIERS: {
    [id: string]: PseudoModifier
} = {
    pseudo_jewellery_elemental_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.ElementalDamage
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_caster_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.CasterModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_attack_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.AttackModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_defense_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.DefenceModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_resource_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.LifeAndManaModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_resistance_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.ResistanceModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_jewellery_attribute_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.AttributeModifiers
            ? item.properties.quality.value.text
            : undefined
    },
    pseudo_total_strength: {
        mods: [
            { id: 'base_strength', type: ModifierType.Addition },
            { id: 'base_strength_and_dexterity', type: ModifierType.Addition },
            { id: 'base_strength_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_dexterity: {
        mods: [
            { id: 'base_dexterity', type: ModifierType.Addition },
            { id: 'base_strength_and_dexterity', type: ModifierType.Addition },
            { id: 'base_dexterity_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_intelligence: {
        mods: [
            { id: 'base_intelligence', type: ModifierType.Addition },
            { id: 'base_strength_and_intelligence', type: ModifierType.Addition },
            { id: 'base_dexterity_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_all_attributes: {
        mods: [
            { id: 'pseudo_total_strength', type: ModifierType.MinimumRequired },
            { id: 'pseudo_total_dexterity', type: ModifierType.MinimumRequired },
            { id: 'pseudo_total_intelligence', type: ModifierType.MinimumRequired },
        ],
        count: 2
    },
    pseudo_total_life: {
        mods: [
            { id: 'base_maximum_life', type: ModifierType.Addition },
            { id: 'pseudo_total_strength', type: ModifierType.Addition5Every10 },
        ]
    },
    pseudo_total_mana: {
        mods: [
            { id: 'base_maximum_mana', type: ModifierType.Addition },
            { id: 'pseudo_total_intelligence', type: ModifierType.Addition1Every2 },
        ]
    },
    pseudo_total_energy_shield: {
        mods: [
            { id: 'base_maximum_energy_shield', type: ModifierType.Addition },
            { id: 'local_energy_shield', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_energy_shield: {
        mods: [
            { id: 'maximum_energy_shield_+%', type: ModifierType.Addition },
            { id: 'local_energy_shield_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_total_fire_resistance: {
        mods: [
            { id: 'base_fire_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'fire_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_lightning_resistance: {
        mods: [
            { id: 'base_lightning_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'lightning_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
            { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_cold_resistance: {
        mods: [
            { id: 'base_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'cold_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_elemental_resistance: {
        mods: [
            { id: 'pseudo_total_fire_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_lightning_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_cold_resistance', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_all_elemental_resistances: {
        mods: [
            { id: 'pseudo_total_fire_resistance', type: ModifierType.MinimumRequired },
            { id: 'pseudo_total_lightning_resistance', type: ModifierType.MinimumRequired },
            { id: 'pseudo_total_cold_resistance', type: ModifierType.MinimumRequired },
        ],
        count: 2
    },
    pseudo_total_chaos_resistance: {
        mods: [
            { id: 'base_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'lightning_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'cold_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_resistance: {
        mods: [
            { id: 'pseudo_total_elemental_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_chaos_resistance', type: ModifierType.Addition },
        ],
        count: 2
    },
};
