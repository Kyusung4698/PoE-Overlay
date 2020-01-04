import { Injectable } from '@angular/core';
import { Currency, EvaluateItem, ItemSearchEvaluateResult, ItemSearchResult } from '@shared/module/poe/type';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencyConverterService } from '../currency/currency-converter.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchEvaluateService {

    constructor(
        private readonly currencyConverterService: CurrencyConverterService) { }

    public evaluate(itemSearchResult: ItemSearchResult, targetCurrency: Currency): Observable<ItemSearchEvaluateResult> {
        const items$ = itemSearchResult.items.map(item =>
            this.currencyConverterService.convert(item.currency, targetCurrency).pipe(
                map(factor => {
                    const evaluateItem: EvaluateItem = {
                        ...item,
                        originalCurrency: item.currency,
                        originalCurrencyAmount: item.currencyAmount,
                        targetCurrency,
                        targetCurrencyAmount: item.currencyAmount * factor
                    };
                    return evaluateItem;
                })
            ));
        return forkJoin(items$).pipe(
            map(items => {
                // TODO: Should this be configureable?
                const shortenList = items.slice(0, Math.max(items.length, 1));
                const avg = shortenList.reduce((a, b) => a + b.targetCurrencyAmount, 0) / shortenList.length;
                const result: ItemSearchEvaluateResult = {
                    items: shortenList,
                    targetCurrency,
                    targetCurrencyAvg: Math.round(avg * 100) / 100
                };
                return result;
            })
        );
    }
}
