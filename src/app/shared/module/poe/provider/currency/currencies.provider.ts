import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import * as PoETrade from '@data/poe-trade';
import { CurrenciesMap, Currency, Language, LanguageMap } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesProvider {
    private readonly languageMap: LanguageMap<BehaviorSubject<CurrenciesMap[]>> = {};

    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService,
        private readonly currencyHttpService: PoETrade.CurrencyHttpService) { }

    public provide(language: Language): Observable<CurrenciesMap[]> {
        const currencies = this.languageMap[language];
        if (currencies) {
            return currencies.pipe(
                filter(result => !!result),
                take(1));
        }
        this.languageMap[language] = new BehaviorSubject<CurrenciesMap[]>(undefined);
        return this.fetch(language);
    }

    private fetch(language: Language): Observable<CurrenciesMap[]> {
        return forkJoin(
            this.currencyHttpService.get(),
            this.tradeHttpService.getStatic(language)
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
            tap(currencies => this.languageMap[language].next(currencies))
        );
    }
}
