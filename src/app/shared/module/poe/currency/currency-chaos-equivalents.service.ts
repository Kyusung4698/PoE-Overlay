import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ContextService } from '../context';
import { CurrencyChaosEquivalentsProvider } from './currency-chaos-equivalents.provider';
import { CurrencyService } from './currency.service';

@Injectable({
    providedIn: 'root'
})
export class CurrencyChaosEquivalentsService {
    constructor(
        private readonly chaosEquivalents: CurrencyChaosEquivalentsProvider,
        private readonly currency: CurrencyService,
        private readonly context: ContextService) {
    }

    public get(currency: string, leagueId?: string): Observable<number> {
        leagueId = leagueId || this.context.get().leagueId;

        return this.currency.searchById(currency, Language.English).pipe(
            mergeMap(englishCurrency => {
                if (!englishCurrency) {
                    return of(undefined);
                }
                return this.chaosEquivalents.provide(leagueId).pipe(
                    map(values => values[englishCurrency.nameType])
                );
            })
        );
    }
}
