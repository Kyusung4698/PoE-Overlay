import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { ContextService } from '../context';
import { CurrenciesProvider } from './currencies.provider';
import { Currency } from './currency';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesService {

    constructor(
        private readonly context: ContextService,
        private readonly currenciesProvider: CurrenciesProvider) { }

    public get(language?: Language): Observable<Currency[]> {
        language = language || this.context.get().language;

        return this.currenciesProvider.provide(language);
    }
}
