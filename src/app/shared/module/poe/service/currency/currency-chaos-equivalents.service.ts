import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { CurrencyChaosEquivalentsProvider } from '../../provider';
import { Currency, Language } from '../../type';
import { ContextService } from '../context.service';
import { CurrencyService } from './currency.service';

@Injectable({
    providedIn: 'root'
})
export class CurrencyChaosEquivalentsService {
    constructor(
        private readonly currencyChaosEquivalentsProvider: CurrencyChaosEquivalentsProvider,
        private readonly currencyService: CurrencyService,
        private readonly context: ContextService) {
    }

    public getById(currency: Currency, leagueId?: string): Observable<number> {
        leagueId = leagueId || this.context.get().leagueId;

        return this.currencyService.searchById(currency.id, Language.English).pipe(
            flatMap(englishCurrency => {
                if (!englishCurrency) {
                    return of(undefined);
                }
                return this.currencyChaosEquivalentsProvider.provide(leagueId).pipe(
                    map(values => values[englishCurrency.nameType])
                );
            })
        );
    }
}
