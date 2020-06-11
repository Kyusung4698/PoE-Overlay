import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { CurrencyOverviewHttpService, CurrencyOverviewType } from '@data/poe-ninja';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencyChaosEquivalents } from './currency-chaos-equivalents';

const CACHE_EXPIRY = 1000 * 60 * 30;

@Injectable({
    providedIn: 'root'
})
export class CurrencyChaosEquivalentsProvider {

    constructor(
        private readonly currencyOverview: CurrencyOverviewHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(leagueId: string): Observable<CurrencyChaosEquivalents> {
        const key = `currency_chaos_equivalents_${leagueId}`;
        return this.cache.proxy(key, () => this.fetch(leagueId), CACHE_EXPIRY);
    }

    private fetch(leagueId: string): Observable<CurrencyChaosEquivalents> {
        return this.currencyOverview.get(leagueId, CurrencyOverviewType.Currency).pipe(
            map(response => {
                const currencyChaosEquivalents: CurrencyChaosEquivalents = {};
                response.lines.forEach(line => {
                    currencyChaosEquivalents[line.currencyTypeName] = line.chaosEquivalent;
                });
                currencyChaosEquivalents['Chaos Orb'] = 1;
                return currencyChaosEquivalents;
            })
        );
    }
}
