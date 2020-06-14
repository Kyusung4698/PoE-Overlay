import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradeStatic, TradeStaticGroup } from './trade-statics';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class TradeStaticsProvider {
    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(language: Language): Observable<TradeStaticGroup[]> {
        const key = `trade_statics_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<TradeStaticGroup[]> {
        return this.trade.getStatics(language).pipe(
            map(({ result }) => {
                return result.map(x => {
                    const group: TradeStaticGroup = {
                        id: x.id,
                        name: x.label,
                        items: x.entries.map(entry => {
                            const item: TradeStatic = {
                                id: entry.id,
                                name: entry.text,
                                image: entry.image
                            };
                            return item;
                        })
                    };
                    return group;
                }).filter(group => group.items.length > 0);
            })
        );
    }
}
