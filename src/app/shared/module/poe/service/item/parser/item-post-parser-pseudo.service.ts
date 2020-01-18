import { Injectable } from '@angular/core';
import { Item, ItemPostParserService, ItemStat, StatType } from '@shared/module/poe/type';

enum ModifierType {
    Addition,
    Addition5Every10,
    Addition1Every2,
    MinimumRequired,
}

interface Modifier {
    id: string;
    type: ModifierType;
}

const PSEUDO_MAP: {
    [id: string]: Modifier[]
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

@Injectable({
    providedIn: 'root'
})
export class ItemPostParserPseudoService implements ItemPostParserService {
    public process(item: Item): void {
        if (!item.stats) {
            return;
        }

        const itemStats = [...item.stats];
        Object.getOwnPropertyNames(PSEUDO_MAP).forEach(id => {
            let values = [];
            let count = 0;
            for (const mod of PSEUDO_MAP[id]) {
                const stats = itemStats.filter(x => x.id === mod.id && x.values.length > 0);
                if (stats.length <= 0) {
                    if (mod.type === ModifierType.MinimumRequired) {
                        values = [];
                        break;
                    }
                    continue;
                }
                stats.forEach(stat => {
                    ++count;
                    values = this.calculateValue(stat, mod.type, values);
                });
            }
            const itemStat: ItemStat = {
                id, type: StatType.Pseudo,
                predicate: '#', tradeId: id,
                values: values.map((x: number) => ({ text: `${+x.toFixed(2)}` })),
                negated: false, mod: undefined
            };
            itemStats.push(itemStat);
            if (values.length > 0 && count > 1) {
                item.stats.push(itemStat);
            }
        });
    }

    private calculateValue(stat: ItemStat, type: ModifierType, values: number[]): number[] {
        while (stat.values.length > values.length) {
            values.push(0);
        }

        return values.map((current, index) => {
            const itemValue = stat.values[index] || stat.values[0];
            if (!itemValue) {
                return current;
            }

            const parsed = this.parseValue(itemValue.text);
            const negate = !stat.negated && stat.predicate[0] === 'N'
                ? -1 : 1;

            const value = parsed * negate;
            if (type === ModifierType.MinimumRequired) {
                if (current === 0) {
                    return value;
                }
                return Math.min(value, current);
            }
            if (type === ModifierType.Addition5Every10) {
                return current + (value / 10) * 5;
            }
            if (type === ModifierType.Addition1Every2) {
                return current + (value / 2);
            }
            return current + value;
        });
    }

    private parseValue(text: string): number {
        return +text.replace('%', '');
    }
}
