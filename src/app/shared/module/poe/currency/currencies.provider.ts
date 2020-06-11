import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { Language, TradeStaticHttpResultId } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Currency } from './currency';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class CurrenciesProvider {
    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(language: Language): Observable<Currency[]> {
        const key = `currencies_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<Currency[]> {
        return this.trade.getStatics(language).pipe(
            map(({ result }) => {
                const currencyGroup = result.find(group => group.id === TradeStaticHttpResultId.Currency);
                if (!currencyGroup?.entries) {
                    return [];
                }
                return currencyGroup.entries.map(entry => {
                    const currency: Currency = {
                        id: entry.id,
                        nameType: entry.text,
                        image: entry.image
                    };
                    return currency;
                });
            })
        );
    }
}
