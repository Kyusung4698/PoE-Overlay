import { Injectable } from '@angular/core';
import { Query, StatsFilter } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersStatsService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        const stats = (item.stats || []).filter(stat => !!stat);
        if (stats.length <= 0) {
            return;
        }

        query.stats.push({
            type: 'and',
            filters: stats.map(stat => {
                const id = `${stat.type}.${stat.tradeId}`;
                const filter: StatsFilter = {
                    disabled: false,
                    id
                };

                if (stat.option) {
                    filter.value = {
                        option: stat.predicate
                    };
                } else {
                    const mins = stat.values.filter(x => x.min !== undefined);
                    const maxs = stat.values.filter(x => x.max !== undefined);

                    if (mins.length === 0 && maxs.length === 0) {
                        return filter;
                    }

                    const negate = !stat.negated && stat.predicate[0] === 'N'
                        ? -1 : 1;

                    let min: number;
                    if (mins.length > 0) {
                        min = mins.reduce((a, b) => a + b.min, 0) / mins.length;
                        min = Math.round(min * 10) / 10;
                        min *= negate;
                    }

                    let max: number;
                    if (maxs.length > 0) {
                        max = maxs.reduce((a, b) => a + b.max, 0) / maxs.length;
                        max = Math.round(max * 10) / 10;
                        max *= negate;
                    }

                    if (min !== undefined && max !== undefined) {
                        if (min > max) {
                            const tmp = min;
                            min = max;
                            max = tmp;
                        }
                    } else if (min !== undefined) {
                        if (min >= 0 || !stat.negated) {
                            max = 99999;
                        } else {
                            max = min;
                            min = -99999;
                        }
                    } else if (max !== undefined) {
                        if (max >= 0) {
                            min = 0;
                        } else {
                            min = max;
                            max = -1;
                        }
                    }
                    filter.value = { min, max };
                }

                return filter;
            })
        });
    }
}
