import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { Currency, Language, LanguageMap } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class CurrenciesProvider {
    private readonly languageMap: LanguageMap<Observable<Currency[]>> = {};

    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(language: Language): Observable<Currency[]> {
        return this.languageMap[language] || (
            this.languageMap[language] = this.fetch(language).pipe(shareReplay(CACHE_SIZE))
        );
    }

    private fetch(language: Language): Observable<Currency[]> {
        return this.tradeHttpService.getStatic(language).pipe(
            map(response => {
                const currencyGroup = response.result.find(group => group.id === 'Currency');
                if (!currencyGroup) {
                    return [];
                }
                return currencyGroup.entries.map(entry => {
                    const currency: Currency = {
                        id: entry.id,
                        nameType: entry.text,
                        image: entry.image
                    };
                    return currency;
                });
            })
        );
    }
}
