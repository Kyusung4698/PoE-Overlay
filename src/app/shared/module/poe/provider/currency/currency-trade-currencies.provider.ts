import { Injectable } from '@angular/core';
import * as PoETrade from '@data/poe-trade';
import { CurrencyTrade } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CurrencyTradeCurrenciesProvider {
    private cache$: Observable<CurrencyTrade[]>;

    constructor(
        private readonly currencyHttpService: PoETrade.CurrencyHttpService) { }

    public provide(): Observable<CurrencyTrade[]> {
        return this.cache$ || (this.cache$ = this.fetch().pipe(
            shareReplay(CACHE_SIZE)
        ));
    }

    private fetch(): Observable<CurrencyTrade[]> {
        return this.currencyHttpService.get().pipe(
            map(response => {
                const statics: CurrencyTrade[] = [
                    {
                        tradeId: 'chromatic',
                        nameType: 'Chromatic Orb'
                    },
                    {
                        tradeId: 'jewellers',
                        nameType: `Jeweller's Orb`
                    }
                ];

                const dynamics = response.currencies.map(currency => {
                    const result: CurrencyTrade = {
                        tradeId: currency.title,
                        nameType: currency.text,
                    };
                    return result;
                });

                return statics.concat(dynamics);
            }),
        );
    }
}
