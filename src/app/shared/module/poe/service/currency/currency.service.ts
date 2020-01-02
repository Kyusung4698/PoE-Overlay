import { Injectable } from '@angular/core';
import { CurrenciesProvider } from '@shared/module/poe/provider';
import { Currency, Language, LanguageMap } from '@shared/module/poe/type';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';

interface CurrencyMap {
    [key: string]: Currency;
}

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private readonly languageMap: LanguageMap<BehaviorSubject<CurrencyMap>> = {};

    constructor(
        private readonly currenciesProvider: CurrenciesProvider) { }

    public get(id: string): Observable<Currency> {
        return this.getOrCreateMap(Language.English).pipe(
            map(currencyMap => currencyMap[id])
        );
    }

    private getOrCreateMap(language: Language): Observable<CurrencyMap> {
        const currencies = this.languageMap[language];
        if (currencies) {
            return currencies.pipe(
                filter(currencyMap => !!currencyMap),
                take(1));
        }

        this.languageMap[language] = new BehaviorSubject<CurrencyMap>(undefined);
        return this.createMap(language);
    }

    private createMap(language: Language): Observable<CurrencyMap> {
        return this.currenciesProvider.provide(language).pipe(
            map(currenciesMaps => {
                const currencyMap: CurrencyMap = {};
                currenciesMaps.forEach(currenciesMap => {
                    currenciesMap.currencies.forEach(currency => {
                        currencyMap[currency.id] = currency;
                    });
                });
                return currencyMap;
            }),
            tap(currencyMap => this.languageMap[language].next(currencyMap))
        );
    }
}
