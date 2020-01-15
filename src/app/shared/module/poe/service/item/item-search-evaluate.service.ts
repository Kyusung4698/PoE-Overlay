import { Injectable } from '@angular/core';
import { Currency, EvaluateItem, EvaluateItemGrouped, ItemSearchEvaluateResult, ItemSearchResult } from '@shared/module/poe/type';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { CurrencyConverterService } from '../currency/currency-converter.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchEvaluateService {

    constructor(
        private readonly currencyConverterService: CurrencyConverterService) { }

    public evaluate(itemSearchResult: ItemSearchResult, targetCurrencies: Currency[]): Observable<ItemSearchEvaluateResult> {
        return of(targetCurrencies).pipe(
            flatMap(currencies => this.convertIntoCurrencies(currencies, itemSearchResult)),
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

        const sortedByAmoundRounded = items.sort((a, b) => a.targetCurrencyAmountRounded - b.targetCurrencyAmountRounded);
        const itemsGrouped: EvaluateItemGrouped[] = [
            {
                value: sortedByAmoundRounded[0].targetCurrencyAmountRounded,
                items: []
            }
        ];

        let mode = 0;
        let modeCount = 0;
        for (const item of sortedByAmoundRounded) {
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

        let groupMinIndex = -1;
        let groupMaxIndex = -1;
        let groupMin = Number.MAX_SAFE_INTEGER;
        let groupMax = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < converted.length; i++) {
            let itemMin = Number.MAX_SAFE_INTEGER;
            let itemMax = Number.MIN_SAFE_INTEGER;
            for (const item of converted[i]) {
                if (item.targetCurrencyAmount < itemMin) {
                    itemMin = item.targetCurrencyAmount;
                }
                if (item.targetCurrencyAmount > itemMax) {
                    itemMax = item.targetCurrencyAmount;
                }
            }
            if (itemMin >= 1) { // atleast 1
                if (itemMin < groupMin) { // sort by lowest value
                    groupMinIndex = i;
                    groupMin = itemMin;
                }
            } else {
                if (itemMax > groupMax) { // sort by highest value
                    groupMaxIndex = i;
                    groupMax = itemMax;
                }
            }
        }
        // use highest value if no value is > 1
        const index = groupMinIndex === -1 ? groupMaxIndex : groupMinIndex;
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
