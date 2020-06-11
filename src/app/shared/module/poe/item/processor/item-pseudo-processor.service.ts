import { Injectable } from '@angular/core';
import { Item, ItemStat } from '../item';
import { StatType } from '../stat';
import { ModifierType, PSEUDO_MODIFIERS } from './item-pseudo-processor.config';

@Injectable({
    providedIn: 'root'
})
export class ItemPseudoProcessorService {
    public process(item: Item): void {
        if (!item.stats) {
            item.stats = [];
        }

        const itemStats = [...item.stats];
        Object.getOwnPropertyNames(PSEUDO_MODIFIERS).forEach(id => {
            const pseudo = PSEUDO_MODIFIERS[id];
            let values: number[] = [];
            let count = 0;
            let minCount = pseudo.count;

            if (pseudo.mods) {
                for (const mod of pseudo.mods) {
                    const stats = itemStats.filter(x => x.id === mod.id && x.values.length > 0);
                    if (stats.length <= 0) {
                        if (mod.type === ModifierType.MinimumRequired) {
                            values = [];
                            break;
                        }
                        continue;
                    }

                    if (mod.count && (!minCount || mod.count > minCount)) {
                        minCount = mod.count;
                    }

                    stats.forEach(stat => {
                        ++count;
                        values = this.calculateValue(stat, mod.type, values);

                        if (stat.type !== StatType.Pseudo) {
                            item.stats = item.stats.filter(y => y !== stat);
                        }
                    });
                }
            } else if (pseudo.prop) {
                const prop = pseudo.prop(item);
                if (prop !== undefined) {
                    values.push(prop);
                }
            }

            const itemStat: ItemStat = {
                id,
                type: StatType.Pseudo,
                predicate: '#',
                tradeId: id,
                values: values.map(x => ({
                    text: `${Math.round(x * 10) / 10}`,
                    value: x
                })),
                negated: false,
                option: false,
                mod: undefined
            };
            itemStats.push(itemStat);

            if (values.length > 0 && (!minCount || count >= minCount)) {
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

            const negate = !stat.negated && stat.predicate[0] === 'N'
                ? -1 : 1;

            const value = itemValue.value * negate;
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
}
