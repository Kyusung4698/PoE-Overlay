import { Injectable } from '@angular/core';
import { Currency, EvaluateItem, EvaluateItemGrouped, ItemSearchEvaluateResult, ItemSearchResult } from '@shared/module/poe/type';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        const sortedByAmount = items.sort((a, b) => a.targetAmount - b.targetAmount);

        const min = sortedByAmount[0].targetAmount;
        const max = sortedByAmount[sortedByAmount.length - 1].targetAmount;

        const sortedByAmountRounded = items.sort((a, b) => a.targetAmountRounded - b.targetAmountRounded);
        const itemsGrouped: EvaluateItemGrouped[] = [
            {
                value: sortedByAmountRounded[0].targetAmountRounded,
                items: []
            }
        ];

        let mode = 0;
        let modeCount = 0;
        for (const item of sortedByAmountRounded) {
            const index = itemsGrouped.length - 1;
            if (itemsGrouped[index].value === item.targetAmountRounded) {
                itemsGrouped[index].items.push(item);
                if (itemsGrouped[index].items.length > modeCount) {
                    modeCount = itemsGrouped[index].items.length;
                    mode = itemsGrouped[index].value;
                }
            } else {
                itemsGrouped.push({
                    value: item.targetAmountRounded,
                    items: [item]
                });
            }
        }

        const mean = items.reduce((a, b) => a + b.targetAmount, 0) / items.length;
        const center = Math.floor(sortedByAmount.length / 2);
        const median = sortedByAmount.length % 2
            ? sortedByAmount[center].targetAmount
            : (sortedByAmount[center - 1].targetAmount + sortedByAmount[center].targetAmount) / 2;

        const result: ItemSearchEvaluateResult = {
            url: itemSearchResult.url,
            total: itemSearchResult.total,
            items,
            itemsGrouped,
            currency: items[0].target,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            mode: Math.round(mode * 100) / 100,
            mean: Math.round(mean * 100) / 100,
            median: Math.round(median * 100) / 100
        };
        return result;
    }

    private convertIntoCurrencies(currencies: Currency[], itemSearchResult: ItemSearchResult): Observable<EvaluateItem[][]> {
        const converted = currencies.map(target => forkJoin(itemSearchResult.items
            .map(item => forkJoin(
                this.currencyConverterService.convert(item.currency, 'chaos'),
                this.currencyConverterService.convert(item.currency, target),
                this.currencyConverterService.convert('chaos', target),
            ).pipe(
                map(factors => {
                    const chaosAmount = item.currencyAmount * factors[0];
                    const chaosAmountRounded = this.round(chaosAmount);

                    const targetAmount = item.currencyAmount * factors[1];
                    const targetAmountRounded = chaosAmountRounded * factors[2];

                    const evaluateItem: EvaluateItem = {
                        ...item,
                        original: item.currency,
                        originalAmount: item.currencyAmount,
                        target,
                        targetAmount,
                        targetAmountRounded: Math.round(targetAmountRounded * 10) / 10
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
        const values = converted.map(x => x.map(y => y.targetAmount));
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
