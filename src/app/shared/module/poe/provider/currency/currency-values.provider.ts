import { Injectable } from '@angular/core';
import * as PoENinja from '@data/poe-ninja';
import { CurrencyChaosEquivalents } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

interface EquivalentsPerLeague {
    [leagueId: string]: BehaviorSubject<CurrencyChaosEquivalents>;
}

@Injectable({
    providedIn: 'root'
})
export class CurrencyChaosEquivalentsProvider {
    private readonly equivalentsPerLeague: EquivalentsPerLeague = {};

    constructor(
        private readonly currencyOverviewHttpService: PoENinja.CurrencyOverviewHttpService) { }

    public provide(leagueId: string): Observable<CurrencyChaosEquivalents> {
        if (this.equivalentsPerLeague[leagueId]) {
            return this.equivalentsPerLeague[leagueId].pipe(
                filter(equivalents => !!equivalents),
                take(1));
        }
        this.equivalentsPerLeague[leagueId] = new BehaviorSubject<CurrencyChaosEquivalents>(undefined);
        return this.fetch(leagueId);
    }

    private fetch(leagueId: string): Observable<CurrencyChaosEquivalents> {
        return this.currencyOverviewHttpService.get(leagueId).pipe(
            map(response => {
                const currencyChaosEquivalents: CurrencyChaosEquivalents = {};
                response.lines.forEach(line => {
                    currencyChaosEquivalents[line.currencyTypeName] = line.chaosEquivalent;
                });
                currencyChaosEquivalents['Chaos Orb'] = 1;
                return currencyChaosEquivalents;
            }),
            tap(equivalents => this.equivalentsPerLeague[leagueId].next(equivalents))
        );
    }
}
