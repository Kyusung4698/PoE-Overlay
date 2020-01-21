import { Injectable } from '@angular/core';
import { ModifierType, PSEUDO_MODIFIERS } from '@shared/module/poe/config/pseudo.config';
import { Item, ItemPostParserService, ItemStat, StatType } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemPostParserPseudoService implements ItemPostParserService {
    public process(item: Item): void {
        if (!item.stats) {
            return;
        }

        const itemStats = [...item.stats];
        Object.getOwnPropertyNames(PSEUDO_MODIFIERS).forEach(id => {
            let values = [];
            let count = 0;

            const mods = PSEUDO_MODIFIERS[id];
            if (mods instanceof Array) {
                for (const mod of PSEUDO_MODIFIERS[id]) {
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
