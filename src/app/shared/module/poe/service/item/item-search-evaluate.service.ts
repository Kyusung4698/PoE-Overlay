import { Injectable } from '@angular/core';
import { Currency, EvaluateItem, EvaluateItemGrouped, ItemSearchEvaluateResult, ItemSearchResult } from '@shared/module/poe/type';
import { forkJoin, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchEvaluateService {

    constructor(
        private readonly currencyConverterService: CurrencyConverterService,
        private readonly currencySelectService: CurrencySelectService) { }

    public evaluate(itemSearchResult: ItemSearchResult, currencies: Currency[]): Observable<ItemSearchEvaluateResult> {
        return this.convertIntoCurrencies(currencies, itemSearchResult).pipe(
            map(converted => this.findMinCurrencyWithAtleast1(converted)),
            map(items => {
                if (!items || items.length <= 0) {
                    const empty: ItemSearchEvaluateResult = {
                        url: itemSearchResult.url,
                        total: itemSearchResult.total,
                        items,
                    };
                    return empty;
                }
                return this.calculateMetrics(items, itemSearchResult);
            })
        );
    }

    private calculateMetrics(items: EvaluateItem[], itemSearchResult: ItemSearchResult): ItemSearchEvaluateResult {
        const sortedByAmount = items.sort((a, b) => a.targetCurrencyAmount - b.targetCurrencyAmount);

        const min = sortedByAmount[0].targetCurrencyAmount;
        const max = sortedByAmount[sortedByAmount.length - 1].targetCurrencyAmount;

        const sortedByAmountRounded = items.sort((a, b) => a.targetCurrencyAmountRounded - b.targetCurrencyAmountRounded);
        const itemsGrouped: EvaluateItemGrouped[] = [
            {
                value: sortedByAmountRounded[0].targetCurrencyAmountRounded,
                items: []
            }
        ];

        let mode = 0;
        let modeCount = 0;
        for (const item of sortedByAmountRounded) {
            const index = itemsGrouped.length - 1;
            if (itemsGrouped[index].value === item.targetCurrencyAmountRounded) {
                itemsGrouped[index].items.push(item);
                if (itemsGrouped[index].items.length > modeCount) {
                    modeCount = itemsGrouped[index].items.length;
                    mode = itemsGrouped[index].value;
                }
            } else {
                itemsGrouped.push({
                    value: item.targetCurrencyAmountRounded,
                    items: [item]
                });
            }
        }

        const mean = items.reduce((a, b) => a + b.targetCurrencyAmount, 0) / items.length;
        const center = Math.floor(sortedByAmount.length / 2);
        const median = sortedByAmount.length % 2
            ? sortedByAmount[center].targetCurrencyAmount
            : (sortedByAmount[center - 1].targetCurrencyAmount + sortedByAmount[center].targetCurrencyAmount) / 2;

        const result: ItemSearchEvaluateResult = {
            url: itemSearchResult.url,
            total: itemSearchResult.total,
            items,
            itemsGrouped,
            targetCurrency: items[0].targetCurrency,
            targetCurrencyMin: Math.round(min * 100) / 100,
            targetCurrencyMax: Math.round(max * 100) / 100,
            targetCurrencyMode: Math.round(mode * 100) / 100,
            targetCurrencyMean: Math.round(mean * 100) / 100,
            targetCurrencyMedian: Math.round(median * 100) / 100
        };
        return result;
    }

    private convertIntoCurrencies(currencies: Currency[], itemSearchResult: ItemSearchResult): Observable<EvaluateItem[][]> {
        const converted = currencies.map(targetCurrency => forkJoin(itemSearchResult.items
            .map(item => this.currencyConverterService.convert(item.currency, targetCurrency).pipe(
                filter(factor => factor !== undefined),
                map(factor => {
                    const targetCurrencyAmount = item.currencyAmount * factor;
                    const evaluateItem: EvaluateItem = {
                        ...item,
                        originalCurrency: item.currency,
                        originalCurrencyAmount: item.currencyAmount,
                        targetCurrency,
                        targetCurrencyAmount,
                        targetCurrencyAmountRounded: this.round(targetCurrencyAmount)
                    };
                    return evaluateItem;
                })
            ))
        ));
        return forkJoin(converted);
    }

    private findMinCurrencyWithAtleast1(converted: EvaluateItem[][]): EvaluateItem[] {
        if (converted.length === 1) {
            return converted[0];
        }
        const values = converted.map(x => x.map(y => y.targetCurrencyAmount));
        const index = this.currencySelectService
            .select(values, CurrencySelectStrategy.MinWithAtleast1);
        return converted[index];
    }

    private round(value: number): number {
        if (value <= 1) {
            return Math.round(value * 4) / 4;
        } else if (value <= 25) {
            return Math.round(value);
        }
        return Math.round(value / 5) * 5;
    }
}
