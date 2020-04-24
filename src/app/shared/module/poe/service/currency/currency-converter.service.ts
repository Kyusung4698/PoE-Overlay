import { Injectable } from '@angular/core';
import { Currency } from '@shared/module/poe/type';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContextService } from '../context.service';
import { CurrencyChaosEquivalentsService } from './currency-chaos-equivalents.service';

interface CacheEntry {
    expiry: number;
    value: Observable<number>
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
        private readonly currencyChaosEquivalentsService: CurrencyChaosEquivalentsService,
        private readonly contextService: ContextService) { }

    public convert(
        currencyOrId: Currency | string,
        targetCurrencyOrId: Currency | string,
        leagueId?: string): Observable<number> {
        leagueId = leagueId || this.contextService.get().leagueId;

        const currencyId = (currencyOrId as Currency).id || currencyOrId as string;
        const targetCurrencyId = (targetCurrencyOrId as Currency).id || targetCurrencyOrId as string;

        const now = Date.now();
        const cacheKey = `${currencyId}:${targetCurrencyId}:${leagueId}`;
        if (!this.cache[cacheKey] || now > this.cache[cacheKey].expiry) {
            this.cache[cacheKey] = {
                expiry: now + CACHE_EXPIRY,
                value: this.calculateFactor(currencyId, leagueId, targetCurrencyId).pipe(
                    shareReplay(CACHE_SIZE)
                )
            };
        }
        return this.cache[cacheKey].value;
    }

    private calculateFactor(currencyId: string, leagueId: string, targetCurrencyId: string): Observable<number> {
        return forkJoin([
            this.currencyChaosEquivalentsService.getById(currencyId, leagueId),
            this.currencyChaosEquivalentsService.getById(targetCurrencyId, leagueId),
        ]).pipe(map(chaosEquivalents => {
            if (!chaosEquivalents[0]) {
                return undefined;
            }
            if (targetCurrencyId === 'chaos') {
                return chaosEquivalents[0];
            }
            if (!chaosEquivalents[1]) {
                return undefined;
            }
            return chaosEquivalents[0] / chaosEquivalents[1];
        }));
    }
}
