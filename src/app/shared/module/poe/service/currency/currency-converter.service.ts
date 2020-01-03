import { Injectable } from '@angular/core';
import { CurrencyChaosEquivalentsProvider } from '@shared/module/poe/provider';
import { Currency } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../context.service';

@Injectable({
    providedIn: 'root'
})
export class CurrencyConverterService {
    constructor(
        private readonly currencyChaosEquivalentsProvider: CurrencyChaosEquivalentsProvider,
        private readonly contextService: ContextService) { }

    public convert(currency: Currency, targetCurrency: Currency, leagueId?: string): Observable<number> {
        leagueId = leagueId || this.contextService.get().leagueId;
        
        return this.currencyChaosEquivalentsProvider.provide(leagueId).pipe(
            map(equivalents => {
                if (!equivalents[currency.nameType]) {
                    return undefined;
                }
                if (targetCurrency.id === 'chaos') {
                    return equivalents[currency.nameType];
                }
                if (!equivalents[targetCurrency.nameType]) {
                    return undefined;
                }
                return equivalents[currency.nameType] / equivalents[targetCurrency.nameType];
            })
        );
    }
}
