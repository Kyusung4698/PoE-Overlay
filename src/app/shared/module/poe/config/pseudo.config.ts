import { ItemQualityType } from '../type';

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

export const PSEUDO_MODIFIERS: {
    [id: string]: Modifier[] | number
} = {
    pseudo_total_strength: [
        { id: 'base_strength', type: ModifierType.Addition },
        { id: 'base_strength_and_dexterity', type: ModifierType.Addition },
        { id: 'base_strength_and_intelligence', type: ModifierType.Addition },
        { id: 'additional_all_attributes', type: ModifierType.Addition },
    ],
    pseudo_total_dexterity: [
        { id: 'base_dexterity', type: ModifierType.Addition },
        { id: 'base_strength_and_dexterity', type: ModifierType.Addition },
        { id: 'base_dexterity_and_intelligence', type: ModifierType.Addition },
        { id: 'additional_all_attributes', type: ModifierType.Addition },
    ],
    pseudo_total_intelligence: [
        { id: 'base_intelligence', type: ModifierType.Addition },
        { id: 'base_strength_and_intelligence', type: ModifierType.Addition },
        { id: 'base_dexterity_and_intelligence', type: ModifierType.Addition },
        { id: 'additional_all_attributes', type: ModifierType.Addition },
    ],
    pseudo_total_all_attributes: [
        { id: 'pseudo_total_strength', type: ModifierType.MinimumRequired },
        { id: 'pseudo_total_dexterity', type: ModifierType.MinimumRequired },
        { id: 'pseudo_total_intelligence', type: ModifierType.MinimumRequired },
    ],
    pseudo_total_life: [
        { id: 'base_maximum_life', type: ModifierType.Addition },
        { id: 'pseudo_total_strength', type: ModifierType.Addition5Every10 },
    ],
    pseudo_total_mana: [
        { id: 'base_maximum_mana', type: ModifierType.Addition },
        { id: 'pseudo_total_intelligence', type: ModifierType.Addition1Every2 },
    ],
    pseudo_total_fire_resistance: [
        { id: 'base_fire_damage_resistance_%', type: ModifierType.Addition },
        { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
        { id: 'fire_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
        { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
    ],
    pseudo_total_lightning_resistance: [
        { id: 'base_lightning_damage_resistance_%', type: ModifierType.Addition },
        { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
        { id: 'lightning_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'fire_and_lightning_damage_resistance_%', type: ModifierType.Addition },
        { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
    ],
    pseudo_total_cold_resistance: [
        { id: 'base_cold_damage_resistance_%', type: ModifierType.Addition },
        { id: 'base_resist_all_elements_%', type: ModifierType.Addition },
        { id: 'cold_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'fire_and_cold_damage_resistance_%', type: ModifierType.Addition },
        { id: 'cold_and_lightning_damage_resistance_%', type: ModifierType.Addition },
    ],
    pseudo_total_elemental_resistance: [
        { id: 'pseudo_total_fire_resistance', type: ModifierType.Addition },
        { id: 'pseudo_total_lightning_resistance', type: ModifierType.Addition },
        { id: 'pseudo_total_cold_resistance', type: ModifierType.Addition },
    ],
    pseudo_total_all_elemental_resistances: [
        { id: 'pseudo_total_fire_resistance', type: ModifierType.MinimumRequired },
        { id: 'pseudo_total_lightning_resistance', type: ModifierType.MinimumRequired },
        { id: 'pseudo_total_cold_resistance', type: ModifierType.MinimumRequired },
    ],
    pseudo_total_chaos_resistance: [
        { id: 'base_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'fire_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'lightning_and_chaos_damage_resistance_%', type: ModifierType.Addition },
        { id: 'cold_and_chaos_damage_resistance_%', type: ModifierType.Addition },
    ],
    pseudo_total_resistance: [
        { id: 'pseudo_total_elemental_resistance', type: ModifierType.Addition },
        { id: 'pseudo_total_chaos_resistance', type: ModifierType.Addition },
    ]
};
