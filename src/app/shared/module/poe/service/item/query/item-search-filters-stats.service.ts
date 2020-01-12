import { Injectable } from '@angular/core';
import { Query, StatsFilter } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersStatsService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        const stats = item.stats.filter(stat => !!stat);
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
                    if (stat.values.length > 0) {
                        const min = +stat.values[0].replace('%', '');
                        if (!isNaN(min)) {
                            filter.value = { min };
                        }
                    }
                    return filter;
                })
            }
        ];
    }
}
