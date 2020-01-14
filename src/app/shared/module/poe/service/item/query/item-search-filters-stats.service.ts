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


                    const values = (stat.values || []).filter(x => x.min !== undefined && x.max !== undefined);
                    if (values.length > 0) {
                        let min = 0;
                        let max = 0;

                        values.forEach(value => {
                            min += value.min;
                            max += value.max;
                        });
                        min = Math.floor(min / values.length);
                        max = Math.ceil(max / values.length);

                        filter.value = {
                            min: min > max ? max : min,
                            max: max > min ? max : min
                        };
                    }
                    return filter;
                })
            }
        ];
    }
}
