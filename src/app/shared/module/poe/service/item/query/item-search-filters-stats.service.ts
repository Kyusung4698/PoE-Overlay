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

        query.stats = [
            {
                type: 'and',
                filters: stats.map(stat => {
                    const id = `${stat.type}.${stat.tradeId}`;
                    const filter: StatsFilter = {
                        disabled: false,
                        id
                    };

                    const mins = stat.values.filter(x => x.min !== undefined);
                    const maxs = stat.values.filter(x => x.max !== undefined);

                    if (mins.length === 0 && maxs.length === 0) {
                        return filter;
                    }

                    const negate = !stat.negated && stat.predicate[0] === 'N'
                        ? -1 : 1;

                    let min;
                    if (mins.length > 0) {
                        min = Math.floor(mins.reduce((a, b) => a + b.min, 0) / mins.length) * negate;
                    }

                    let max;
                    if (maxs.length > 0) {
                        max = Math.floor(maxs.reduce((a, b) => a + b.max, 0) / maxs.length) * negate;
                    }

                    if (min !== undefined && max !== undefined) {
                        if (min > max) {
                            const tmp = min;
                            min = max;
                            max = tmp;
                        }
                    } else if (min !== undefined) {
                        if (min >= 0) {
                            max = 999;
                        } else {
                            max = -1;
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
                    return filter;
                })
            }
        ];
    }
}
