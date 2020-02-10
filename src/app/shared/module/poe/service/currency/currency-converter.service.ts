import { Injectable } from '@angular/core';
import { Currency } from '@shared/module/poe/type';
import { forkJoin, Observable } from 'rxjs';
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

    public convert(currencyOrId: Currency | string, targetCurrencyOrId: Currency | string, leagueId?: string): Observable<number> {
        leagueId = leagueId || this.contextService.get().leagueId;

        const currencyId = (currencyOrId as Currency).id || currencyOrId as string;
        const targetCurrencyId = (targetCurrencyOrId as Currency).id || targetCurrencyOrId as string;
        return forkJoin([
            this.currencyChaosEquivalentsService.getById(currencyId, leagueId),
            this.currencyChaosEquivalentsService.getById(targetCurrencyId, leagueId),
        ]).pipe(
            map(chaosEquivalents => {
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
            })
        );
    }
}
