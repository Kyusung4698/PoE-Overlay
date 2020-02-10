import { Injectable } from '@angular/core';
import { Currency } from '@shared/module/poe/type';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';
import { ItemSearchResult, SearchListing } from './item-search.service';

export type SearchAnalyzeEntry = SearchListing & {
    original: Currency;
    originalAmount: number;
    target: Currency;
    targetAmount: number;
    targetAmountRounded: number;
};

export interface SearchAnalyzeEntryGrouped {
    value: number;
    hidden: number;
    mean?: string;
    items: SearchAnalyzeEntry[];
}

export interface ItemSearchAnalyzeResult {
    url: string;
    total: number;
    items: SearchAnalyzeEntry[];
    itemsGrouped?: SearchAnalyzeEntryGrouped[];
    currency?: Currency;
    min?: number;
    max?: number;
    mode?: number;
    median?: number;
    mean?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ItemSearchAnalyzeService {

    constructor(
        private readonly currencyConverterService: CurrencyConverterService,
        private readonly currencySelectService: CurrencySelectService) { }

    public analyze(itemSearchResult: ItemSearchResult, currencies: Currency[]): Observable<ItemSearchAnalyzeResult> {
        return this.convert(currencies, itemSearchResult).pipe(
            map(converted => this.findMinCurrencyWithAtleast1(converted)),
            map(items => {
                if (!items || items.length <= 0) {
                    const empty: ItemSearchAnalyzeResult = {
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

    private calculateMetrics(items: SearchAnalyzeEntry[], itemSearchResult: ItemSearchResult): ItemSearchAnalyzeResult {
        const sortedByAmount = items.sort((a, b) => a.targetAmount - b.targetAmount);

        const min = sortedByAmount[0].targetAmount;
        const max = sortedByAmount[sortedByAmount.length - 1].targetAmount;

        const sortedByAmountRounded = items.sort((a, b) => a.targetAmountRounded - b.targetAmountRounded);
        const itemsGrouped: SearchAnalyzeEntryGrouped[] = [
            {
                value: sortedByAmountRounded[0].targetAmountRounded,
                items: [],
                hidden: 0
            }
        ];

        const now = moment();
        let mode = 0;
        let modeCount = 0;
        let sellerGroup = {};
        let meanGroup = 0;

        for (const item of sortedByAmountRounded) {
            const index = itemsGrouped.length - 1;
            if (itemsGrouped[index].value === item.targetAmountRounded) {
                if (!sellerGroup[item.seller]) {
                    itemsGrouped[index].items.push(item);
                    meanGroup += now.diff(item.indexed);
                    sellerGroup[item.seller] = 1;
                } else {
                    if (++sellerGroup[item.seller] <= 3) {
                        itemsGrouped[index].items.push(item);
                        meanGroup += now.diff(item.indexed);
                    } else {
                        itemsGrouped[index].hidden++;
                    }
                }
                if (itemsGrouped[index].items.length > modeCount) {
                    modeCount = itemsGrouped[index].items.length;
                    mode = itemsGrouped[index].value;
                }
            } else {
                itemsGrouped[index].mean = now.clone()
                    .add(Math.floor(meanGroup / itemsGrouped[index].items.length))
                    .to(now);

                meanGroup = now.diff(item.indexed);
                itemsGrouped.push({
                    value: item.targetAmountRounded,
                    items: [item],
                    hidden: 0,
                });
                sellerGroup = {
                    [item.seller]: 1
                };
            }
        }

        itemsGrouped[itemsGrouped.length - 1].mean = now.clone()
            .add(Math.floor(meanGroup / itemsGrouped[itemsGrouped.length - 1].items.length))
            .to(now);

        const mean = items.reduce((a, b) => a + b.targetAmount, 0) / items.length;
        const center = Math.floor(sortedByAmount.length / 2);
        const median = sortedByAmount.length % 2
            ? sortedByAmount[center].targetAmount
            : (sortedByAmount[center - 1].targetAmount + sortedByAmount[center].targetAmount) / 2;

        const result: ItemSearchAnalyzeResult = {
            url: itemSearchResult.url,
            total: itemSearchResult.total,
            items: sortedByAmount,
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

    private convert(currencies: Currency[], itemSearchResult: ItemSearchResult): Observable<SearchAnalyzeEntry[][]> {
        const converted = currencies.map(target => forkJoin(itemSearchResult.items
            .map(listing => forkJoin([
                this.currencyConverterService.convert(listing.currency, 'chaos'),
                this.currencyConverterService.convert(listing.currency, target),
                this.currencyConverterService.convert('chaos', target),
            ]).pipe(
                map(factors => {
                    const chaosAmount = listing.amount * factors[0];
                    const chaosAmountRounded = this.round(chaosAmount);

                    const targetAmount = listing.amount * factors[1];
                    const targetAmountRounded = chaosAmountRounded * factors[2];

                    const evaluateItem: SearchAnalyzeEntry = {
                        ...listing,
                        original: listing.currency,
                        originalAmount: listing.amount,
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

    private findMinCurrencyWithAtleast1(converted: SearchAnalyzeEntry[][]): SearchAnalyzeEntry[] {
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
