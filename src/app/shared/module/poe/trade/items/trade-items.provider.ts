import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradeItem, TradeItemGroup } from './trade-items';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class TradeItemsProvider {
    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(language: Language): Observable<TradeItemGroup[]> {
        const key = `trade_items_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<TradeItemGroup[]> {
        return this.trade.getItems(language).pipe(
            map(response => response.result.map(group => {
                const groups: TradeItemGroup = {
                    name: group.label,
                    items: group.entries.map(entry => {
                        const item: TradeItem = {
                            name: entry.name,
                            type: entry.type,
                            text: entry.text
                        };
                        return item;
                    })
                };
                return groups;
            })),
        );
    }
}
