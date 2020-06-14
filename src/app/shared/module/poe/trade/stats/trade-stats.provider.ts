import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradeStat, TradeStatGroup } from './trade-stats';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class TradeStatsProvider {
    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(language: Language): Observable<TradeStatGroup[]> {
        const key = `trade_stats_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<TradeStatGroup[]> {
        return this.trade.getStats(language).pipe(
            map(response => response.result.map(group => {
                const groups: TradeStatGroup = {
                    name: group.label,
                    items: group.entries.map(entry => {
                        const item: TradeStat = {
                            id: entry.id,
                            type: entry.type,
                            text: entry.text,
                            option: entry.option
                        };
                        return item;
                    })
                };
                return groups;
            })),
        );
    }
}
