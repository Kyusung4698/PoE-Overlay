import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import * as PoETrade from '@data/poe-trade';
import { CurrenciesMap, Currency } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesProvider {
    private currencies: BehaviorSubject<CurrenciesMap[]>;

    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService,
        private readonly currencyHttpService: PoETrade.CurrencyHttpService) { }

    public provide(): Observable<CurrenciesMap[]> {
        if (this.currencies) {
            return this.currencies.pipe(
                filter(currencies => !!currencies),
                take(1));
        }
        this.currencies = new BehaviorSubject<CurrenciesMap[]>(undefined);
        return this.fetch();
    }

    private fetch(): Observable<CurrenciesMap[]> {
        return forkJoin(
            this.currencyHttpService.get(),
            this.tradeHttpService.getStatic()
        ).pipe(
            map(responses => {
                const poeTradeResponse = responses[0];
                const poeResponse = responses[1];
                return poeResponse.result.map(currencyGroup => {
                    const currenciesMap: CurrenciesMap = {
                        label: currencyGroup.label,
                        currencies: currencyGroup.entries.reduce((self, entry) => {
                            const currency: Currency = {
                                id: entry.id,
                                nameType: entry.text,
                                image: entry.image
                            };
                            self.push(currency);

                            if (currency.id === 'chrom') {
                                self.push({
                                    ...currency,
                                    id: 'chromatic'
                                });
                            }

                            if (currency.id === 'jew') {
                                self.push({
                                    ...currency,
                                    id: 'jewellers'
                                });
                            }

                            const poeTradeCurrency = poeTradeResponse.currencies.find(x => x.text === entry.text);
                            if (poeTradeCurrency) {
                                self.push({
                                    ...currency,
                                    id: poeTradeCurrency.title
                                });
                            }
                            return self;
                        }, [])
                    };
                    return currenciesMap;
                });
            }),
            tap(currencies => this.currencies.next(currencies))
        );
    }
}
