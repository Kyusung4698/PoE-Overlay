import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery, TradeSearchHttpStatsFilter } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterStatsService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        const stats = (item.stats || []).filter(stat => !!stat);
        if (stats.length <= 0) {
            return;
        }

        query.stats.push({
            type: 'and',
            filters: stats.map(stat => {
                const id = `${stat.type}.${stat.tradeId}`;
                const filter: TradeSearchHttpStatsFilter = {
                    disabled: false,
                    id
                };

                if (stat.option) {
                    filter.value = {
                        option: isNaN(+stat.predicate) ? stat.predicate : +stat.predicate
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
