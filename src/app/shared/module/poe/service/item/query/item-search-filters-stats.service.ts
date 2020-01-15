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

                    let min = mins.reduce((a, b) => a + b.min, 0);
                    let max = maxs.reduce((a, b) => a + b.max, 0);

                    if (mins.length > 0 && maxs.length > 0) {
                        min = Math.floor(min / mins.length);
                        max = Math.ceil(max / maxs.length);
                        filter.value = {
                            min: min > max ? max : min,
                            max: max > min ? max : min
                        };
                    } else if (mins.length > 0) {
                        min = Math.floor(min / mins.length);
                        filter.value = { min };
                    } else if (maxs.length > 0) {
                        max = Math.ceil(max / maxs.length);
                        filter.value = { max };
                    }
                    return filter;
                })
            }
        ];
    }
}
