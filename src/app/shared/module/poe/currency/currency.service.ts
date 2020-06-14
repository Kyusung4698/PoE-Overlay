import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContextService } from '../context';
import { CurrenciesProvider } from './currencies.provider';
import { Currency } from './currency';

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {
    private cache$: {
        [key: string]: Observable<Currency>
    } = {};

    constructor(
        private readonly context: ContextService,
        private readonly currenciesProvider: CurrenciesProvider) { }

    public searchById(id: string, language?: Language): Observable<Currency> {
        language = language || this.context.get().language;

        const key = this.getCacheKey(id, language);
        if (!this.cache$[key]) {
            this.cache$[key] = this.searchByPredicate(language, x => x.id === id).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[key];
    }

    public searchByNameType(nameType: string, language?: Language): Observable<Currency> {
        language = language || this.context.get().language;

        const key = this.getCacheKey(nameType, language);
        if (!this.cache$[key]) {
            this.cache$[key] = this.searchByPredicate(language, x => x.nameType === nameType).pipe(
                shareReplay(CACHE_SIZE)
            );
        }
        return this.cache$[key];
    }

    private searchByPredicate(language: Language, predicate: (currency: Currency) => boolean): Observable<Currency> {
        return this.currenciesProvider.provide(language).pipe(
            map(currencies => currencies.find(predicate))
        );
    }

    private getCacheKey(key: string, language: Language): string {
        return `${key}:${language}`;
    }
}
