import { Item, ItemQualityType } from '../item';


export enum ModifierType {
    Addition,
    Addition5Every10,
    Addition1Every2,
    MinimumRequired,
}

export interface Modifier {
    id: string;
    type: ModifierType;
    count?: number;
}

export interface PseudoModifier {
    mods?: Modifier[];
    prop?: (item: Item) => number;
    count?: number;
}

/* tslint:disable */
export const PSEUDO_MODIFIERS: {
    [id: string]: PseudoModifier
} = {
    pseudo_jewellery_elemental_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.ElementalDamage
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_caster_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.CasterModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_attack_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.AttackModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_defense_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.DefenceModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_resource_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.LifeAndManaModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_resistance_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.ResistanceModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_jewellery_attribute_quality: {
        prop: item => item.properties && item.properties.qualityType === ItemQualityType.AttributeModifiers
            ? item.properties.quality.value
            : undefined
    },
    pseudo_total_strength: {
        mods: [
            { id: 'additional_strength', type: ModifierType.Addition },
            { id: 'additional_strength_and_dexterity', type: ModifierType.Addition },
            { id: 'additional_strength_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ]
    },
    pseudo_total_dexterity: {
        mods: [
            { id: 'additional_dexterity', type: ModifierType.Addition },
            { id: 'additional_strength_and_dexterity', type: ModifierType.Addition },
            { id: 'additional_dexterity_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ]
    },
    pseudo_total_intelligence: {
        mods: [
            { id: 'additional_intelligence', type: ModifierType.Addition },
            { id: 'additional_strength_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_dexterity_and_intelligence', type: ModifierType.Addition },
            { id: 'additional_all_attributes', type: ModifierType.Addition },
        ]
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
        ]
    },
    pseudo_increased_energy_shield: {
        mods: [
            { id: 'maximum_energy_shield_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_total_fire_resistance: {
        mods: [
            { id: 'base_fire_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'fire_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ]
    },
    pseudo_total_cold_resistance: {
        mods: [
            { id: 'base_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'cold_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
            { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ]
    },
    pseudo_total_lightning_resistance: {
        mods: [
            { id: 'base_lightning_damage_resistance_%', type: ModifierType.Addition },
            { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
            { id: 'lightning_and_chaos_damage_resistance_%', type: ModifierType.Addition },
            { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
            { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        ]
    },
    pseudo_total_elemental_resistance: {
        mods: [
            { id: 'pseudo_total_fire_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_lightning_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_cold_resistance', type: ModifierType.Addition },
        ]
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
        ]
    },
    pseudo_total_resistance: {
        mods: [
            { id: 'pseudo_total_elemental_resistance', type: ModifierType.Addition },
            { id: 'pseudo_total_chaos_resistance', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_total_attack_speed: {
        mods: [
            { id: 'attack_speed_+%', type: ModifierType.Addition },
            // { id: 'attack_and_cast_speed_+%', type: ModifierType.Addition }, 230 -> trade site seems to ignore this
        ]
    },
    pseudo_total_cast_speed: {
        mods: [
            { id: 'base_cast_speed_+%', type: ModifierType.Addition },
            // { id: 'attack_and_cast_speed_+%', type: ModifierType.Addition }, 230 -> trade site seems to ignore this
        ]
    },
    pseudo_increased_movement_speed: {
        mods: [
            { id: 'base_movement_velocity_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_physical_damage: {
        mods: [
            { id: 'physical_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_global_critical_strike_chance: {
        mods: [
            { id: 'global_critical_strike_chance_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_critical_strike_chance_for_spells: {
        mods: [
            { id: 'pseudo_global_critical_strike_chance', type: ModifierType.Addition },
            { id: 'spell_critical_strike_chance_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_global_critical_strike_multiplier: {
        mods: [
            { id: 'global_critical_strike_multiplier_+', type: ModifierType.Addition },
        ]
    },
    /* damage */
    pseudo_adds_physical_damage: {
        mods: [
            { id: 'global_minimum_added_physical_damage global_maximum_added_physical_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_fire_damage: {
        mods: [
            { id: 'global_minimum_added_fire_damage global_maximum_added_fire_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_cold_damage: {
        mods: [
            { id: 'global_minimum_added_cold_damage global_maximum_added_cold_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_lightning_damage: {
        mods: [
            { id: 'global_minimum_added_lightning_damage global_maximum_added_lightning_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_elemental_damage: {
        mods: [
            { id: 'pseudo_adds_lightning_damage', type: ModifierType.Addition },
            { id: 'pseudo_adds_cold_damage', type: ModifierType.Addition },
            { id: 'pseudo_adds_fire_damage', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_adds_chaos_damage: {
        mods: [
            { id: 'global_minimum_added_chaos_damage global_maximum_added_chaos_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_damage: {
        mods: [
            { id: 'pseudo_adds_elemental_damage', type: ModifierType.Addition },
            { id: 'pseudo_adds_chaos_damage', type: ModifierType.Addition },
        ],
        count: 2
    },
    /* damage attacks */
    pseudo_adds_physical_damage_to_attacks: {
        mods: [
            { id: 'attack_minimum_added_physical_damage attack_maximum_added_physical_damage', type: ModifierType.Addition },
            { id: 'local_minimum_added_physical_damage local_maximum_added_physical_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_fire_damage_to_attacks: {
        mods: [
            { id: 'attack_minimum_added_fire_damage attack_maximum_added_fire_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_fire_damage spell_and_attack_maximum_added_fire_damage', type: ModifierType.Addition },
            { id: 'local_minimum_added_fire_damage local_maximum_added_fire_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_cold_damage_to_attacks: {
        mods: [
            { id: 'attack_minimum_added_cold_damage attack_maximum_added_cold_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_cold_damage spell_and_attack_maximum_added_cold_damage', type: ModifierType.Addition },
            { id: 'local_minimum_added_cold_damage local_maximum_added_cold_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_lightning_damage_to_attacks: {
        mods: [
            { id: 'attack_minimum_added_lightning_damage attack_maximum_added_lightning_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_lightning_damage spell_and_attack_maximum_added_lightning_damage', type: ModifierType.Addition },
            { id: 'local_minimum_added_lightning_damage local_maximum_added_lightning_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_elemental_damage_to_attacks: {
        mods: [
            { id: 'pseudo_adds_lightning_damage_to_attacks', type: ModifierType.Addition },
            { id: 'pseudo_adds_cold_damage_to_attacks', type: ModifierType.Addition },
            { id: 'pseudo_adds_fire_damage_to_attacks', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_adds_chaos_damage_to_attacks: {
        mods: [
            { id: 'attack_minimum_added_chaos_damage attack_maximum_added_chaos_damage', type: ModifierType.Addition },
            { id: 'local_minimum_added_chaos_damage local_maximum_added_chaos_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_damage_to_attacks: {
        mods: [
            { id: 'pseudo_adds_elemental_damage_to_attacks', type: ModifierType.Addition },
            { id: 'pseudo_adds_chaos_damage_to_attacks', type: ModifierType.Addition },
        ],
        count: 2
    },
    /* damage spells */
    pseudo_adds_physical_damage_to_spells: {
        mods: [
            { id: 'spell_minimum_added_physical_damage spell_maximum_added_physical_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_fire_damage_to_spells: {
        mods: [
            { id: 'spell_minimum_added_fire_damage spell_maximum_added_fire_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_fire_damage spell_and_attack_maximum_added_fire_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_cold_damage_to_spells: {
        mods: [
            { id: 'spell_minimum_added_cold_damage spell_maximum_added_cold_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_cold_damage spell_and_attack_maximum_added_cold_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_lightning_damage_to_spells: {
        mods: [
            { id: 'spell_minimum_added_lightning_damage spell_maximum_added_lightning_damage', type: ModifierType.Addition },
            { id: 'spell_and_attack_minimum_added_lightning_damage spell_and_attack_maximum_added_lightning_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_elemental_damage_to_spells: {
        mods: [
            { id: 'pseudo_adds_lightning_damage_to_spells', type: ModifierType.Addition },
            { id: 'pseudo_adds_cold_damage_to_spells', type: ModifierType.Addition },
            { id: 'pseudo_adds_fire_damage_to_spells', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_adds_chaos_damage_to_spells: {
        mods: [
            { id: 'spell_minimum_added_chaos_damage spell_maximum_added_chaos_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_adds_damage_to_spells: {
        mods: [
            { id: 'pseudo_adds_elemental_damage_to_spells', type: ModifierType.Addition },
            { id: 'pseudo_adds_chaos_damage_to_spells', type: ModifierType.Addition },
        ],
        count: 2
    },
    pseudo_increased_elemental_damage: {
        mods: [
            { id: 'elemental_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_fire_damage: {
        mods: [
            { id: 'pseudo_increased_elemental_damage', type: ModifierType.Addition },
            { id: 'fire_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_cold_damage: {
        mods: [
            { id: 'pseudo_increased_elemental_damage', type: ModifierType.Addition },
            { id: 'cold_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_lightning_damage: {
        mods: [
            { id: 'pseudo_increased_elemental_damage', type: ModifierType.Addition },
            { id: 'lightning_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_spell_damage: {
        mods: [
            { id: 'spell_damage_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_fire_spell_damage: {
        mods: [
            { id: 'pseudo_increased_fire_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_spell_damage', type: ModifierType.Addition },
        ],
    },
    pseudo_increased_cold_spell_damage: {
        mods: [
            { id: 'pseudo_increased_cold_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_spell_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_lightning_spell_damage: {
        mods: [
            { id: 'pseudo_increased_lightning_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_spell_damage', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_elemental_damage_with_attack_skills: {
        mods: [
            { id: 'elemental_damage_with_attack_skills_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_fire_damage_with_attack_skills: {
        mods: [
            { id: 'pseudo_increased_fire_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_elemental_damage_with_attack_skills', type: ModifierType.Addition },
            { id: 'fire_damage_with_attack_skills_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_cold_damage_with_attack_skills: {
        mods: [
            { id: 'pseudo_increased_cold_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_elemental_damage_with_attack_skills', type: ModifierType.Addition },
            { id: 'cold_damage_with_attack_skills_+%', type: ModifierType.Addition },
        ]
    },
    pseudo_increased_lightning_damage_with_attack_skills: {
        mods: [
            { id: 'pseudo_increased_lightning_damage', type: ModifierType.Addition, count: 2 },
            { id: 'pseudo_increased_elemental_damage_with_attack_skills', type: ModifierType.Addition },
            { id: 'lightning_damage_with_attack_skills_+%', type: ModifierType.Addition },
        ]
    },
};
/* tslint:enable */
