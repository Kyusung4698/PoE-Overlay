import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContextService } from '../context';
import { CurrencyChaosEquivalentsService } from './currency-chaos-equivalents.service';

interface CacheEntry {
    expiry: number;
    value: Observable<number>;
}

const CACHE_SIZE = 1;
const CACHE_EXPIRY = 1000 * 60 * 5;

@Injectable({
    providedIn: 'root'
})
export class CurrencyConverterService {
    private cache: {
        [key: string]: CacheEntry
    } = {};

    constructor(
        private readonly context: ContextService,
        private readonly chaosEquivalents: CurrencyChaosEquivalentsService) { }

    public getConversionRate(
        currency: string,
        targetCurrency: string,
        leagueId?: string
    ): Observable<number> {
        leagueId = leagueId || this.context.get().leagueId;

        const now = Date.now();
        const cacheKey = `${currency}:${targetCurrency}:${leagueId}`;
        if (!this.cache[cacheKey] || now > this.cache[cacheKey].expiry) {
            this.cache[cacheKey] = {
                expiry: now + CACHE_EXPIRY,
                value: this.calculateRate(currency, targetCurrency, leagueId).pipe(
                    shareReplay(CACHE_SIZE)
                )
            };
        }
        return this.cache[cacheKey].value;
    }

    private calculateRate(currency: string, targetCurrency: string, leagueId: string): Observable<number> {
        return forkJoin([
            this.chaosEquivalents.get(currency, leagueId),
            this.chaosEquivalents.get(targetCurrency, leagueId),
        ]).pipe(map(([currencyEquivalent, targetEquivalent]) => {
            if (!currencyEquivalent || !targetEquivalent) {
                return undefined;
            }
            return currencyEquivalent / targetEquivalent;
        }));
    }
}
