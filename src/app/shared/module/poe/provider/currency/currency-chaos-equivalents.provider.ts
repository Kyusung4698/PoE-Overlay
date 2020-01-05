import { Injectable } from '@angular/core';
import * as PoENinja from '@data/poe-ninja';
import { CurrencyChaosEquivalents } from '@shared/module/poe/type';
import { Observable, of, throwError, timer } from 'rxjs';
import { flatMap, shareReplay, switchMap, take } from 'rxjs/operators';

const REFRESH_INTERVAL = 1000 * 60 * 30;
const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CurrencyChaosEquivalentsProvider {
    private readonly equivalentsPerLeague: {
        [leagueId: string]: Observable<CurrencyChaosEquivalents>
    } = {};

    constructor(
        private readonly currencyOverviewHttpService: PoENinja.CurrencyOverviewHttpService) { }

    public provide(leagueId: string): Observable<CurrencyChaosEquivalents> {
        if (!this.equivalentsPerLeague[leagueId]) {
            const timer$ = timer(0, REFRESH_INTERVAL);

            this.equivalentsPerLeague[leagueId] = timer$.pipe(
                switchMap(_ => this.fetch(leagueId)),
                shareReplay(CACHE_SIZE),
            );
        }
        return this.equivalentsPerLeague[leagueId].pipe(
            take(1)
        );
    }

    private fetch(leagueId: string): Observable<CurrencyChaosEquivalents> {
        return this.currencyOverviewHttpService.get(leagueId).pipe(
            flatMap(response => {
                const currencyChaosEquivalents: CurrencyChaosEquivalents = {};
                response.lines.forEach(line => {
                    currencyChaosEquivalents[line.currencyTypeName] = line.chaosEquivalent;
                });
                currencyChaosEquivalents['Chaos Orb'] = 1;
                return of(currencyChaosEquivalents);
            })
        );
    }
}
