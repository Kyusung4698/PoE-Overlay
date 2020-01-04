import { Injectable } from '@angular/core';
import { Currency } from '@shared/module/poe/type';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../context.service';
import { CurrencyChaosEquivalentsService } from './currency-chaos-equivalents.service';

@Injectable({
    providedIn: 'root'
})
export class CurrencyConverterService {
    constructor(
        private readonly currencyChaosEquivalentsService: CurrencyChaosEquivalentsService,
        private readonly contextService: ContextService) { }

    public convert(currency: Currency, targetCurrency: Currency, leagueId?: string): Observable<number> {
        leagueId = leagueId || this.contextService.get().leagueId;

        return forkJoin(
            this.currencyChaosEquivalentsService.getById(currency, leagueId),
            this.currencyChaosEquivalentsService.getById(targetCurrency, leagueId),
        ).pipe(
            map(chaosEquivalents => {
                if (!chaosEquivalents[0]) {
                    return undefined;
                }
                if (targetCurrency.id === 'chaos') {
                    return chaosEquivalents[0];
                }
                if (!chaosEquivalents[1]) {
                    return undefined;
                }
                return chaosEquivalents[0] / chaosEquivalents[1];
            })
        );
    }
}
