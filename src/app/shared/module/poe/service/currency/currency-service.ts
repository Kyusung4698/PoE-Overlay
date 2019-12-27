import { Injectable } from '@angular/core';
import { CurrenciesProvider } from '@shared/module/poe/provider';
import { Currency } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

interface CurrencyMap {
    [key: string]: Currency;
}

interface CurrencyKeyToCurrencyMap {
    [key: string]: BehaviorSubject<CurrencyMap>;
}

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private readonly map: CurrencyKeyToCurrencyMap = {};

    constructor(
        private readonly currenciesProvider: CurrenciesProvider) { }

    public getForId(id: string): Observable<Currency> {
        return this.getOrCreateMap('id', x => x.id).pipe(
            map(currencyMap => currencyMap[id])
        );
    }

    public getForNameType(nameType: string): Observable<Currency> {
        return this.getOrCreateMap('nameType', x => x.nameType).pipe(
            map(currencyMap => currencyMap[nameType])
        );
    }

    private getOrCreateMap(key: string, keyAction: (currency: Currency) => string): Observable<CurrencyMap> {
        if (this.map[key]) {
            return this.map[key].pipe(
                filter(currencyMap => !!currencyMap),
                take(1));
        }

        this.map[key] = new BehaviorSubject<CurrencyMap>(undefined);
        return this.createMap(key, keyAction);
    }

    private createMap(key: string, keyAction: (currency: Currency) => string): Observable<CurrencyMap> {
        return this.currenciesProvider.provide().pipe(
            map(currenciesMaps => {
                const currencyMap: CurrencyMap = {};
                currenciesMaps.forEach(currenciesMap => {
                    currenciesMap.currencies.forEach(currency => {
                        currencyMap[keyAction(currency)] = currency;
                    });
                });
                return currencyMap;
            }),
            tap(currencyMap => this.map[key].next(currencyMap))
        );
    }
}
