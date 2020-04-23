import { Injectable } from '@angular/core';
import { Currency } from '@shared/module/poe/type';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';
import { ItemSearchListing } from './item-search.service';

export type SearchAnalyzeEntry = ItemSearchListing & {
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

export interface SearchAnalyzeValues {
    min?: number;
    max?: number;
    mode?: number;
    median?: number;
    mean?: number;
}

export interface ItemSearchAnalyzeResult {
    entries: SearchAnalyzeEntry[];
    entryGroups?: SearchAnalyzeEntryGrouped[];
    currency?: Currency;
    values?: SearchAnalyzeValues;
}

@Injectable({
    providedIn: 'root'
})
export class ItemSearchAnalyzeService {

    constructor(
        private readonly currencyConverterService: CurrencyConverterService,
        private readonly currencySelectService: CurrencySelectService) { }

    public analyze(listings: ItemSearchListing[], currencies: Currency[]): Observable<ItemSearchAnalyzeResult> {
        return this.convert(currencies, listings).pipe(
            map(converted => this.findMinCurrencyWithAtleast1(converted)),
            map(entries => {
                if (!entries || entries.length <= 0) {
                    const empty: ItemSearchAnalyzeResult = {
                        entries,
                    };
                    return empty;
                }
                return this.calculateMetrics(entries);
            })
        );
    }

    private calculateMetrics(entries: SearchAnalyzeEntry[]): ItemSearchAnalyzeResult {
        const sortedByAmount = entries.sort((a, b) => a.targetAmount - b.targetAmount);

        const min = sortedByAmount[0].targetAmount;
        const max = sortedByAmount[sortedByAmount.length - 1].targetAmount;

        const sortedByAmountRounded = entries.sort((a, b) => a.targetAmountRounded - b.targetAmountRounded);
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

        const mean = entries.reduce((a, b) => a + b.targetAmount, 0) / entries.length;
        const center = Math.floor(sortedByAmount.length / 2);
        const median = sortedByAmount.length % 2
            ? sortedByAmount[center].targetAmount
            : (sortedByAmount[center - 1].targetAmount + sortedByAmount[center].targetAmount) / 2;

        const result: ItemSearchAnalyzeResult = {
            entries: sortedByAmount,
            entryGroups: itemsGrouped,
            currency: entries[0].target,
            values: {
                min: Math.round(min * 100) / 100,
                max: Math.round(max * 100) / 100,
                mode: Math.round(mode * 100) / 100,
                mean: Math.round(mean * 100) / 100,
                median: Math.round(median * 100) / 100
            }
        };
        return result;
    }

    private convert(currencies: Currency[], listings: ItemSearchListing[]): Observable<SearchAnalyzeEntry[][]> {
        const result = currencies.map(currency =>
            this.currencyConverterService.convert('chaos', currency).pipe(
                flatMap(currencyChaosFactor => forkJoin(
                    listings.map(listing =>
                        forkJoin([
                            this.currencyConverterService.convert(listing.currency, 'chaos'),
                            this.currencyConverterService.convert(listing.currency, currency),
                        ]).pipe(map(([chaosFactor, currencyFactor]) => {
                            const chaosAmount = listing.amount * chaosFactor;
                            const chaosAmountRounded = this.round(chaosAmount);

                            const currencyAmount = listing.amount * currencyFactor;
                            const currencyAmountRounded = chaosAmountRounded * currencyChaosFactor;

                            const evaluateItem: SearchAnalyzeEntry = {
                                ...listing,
                                original: listing.currency,
                                originalAmount: listing.amount,
                                target: currency,
                                targetAmount: currencyAmount,
                                targetAmountRounded: Math.round(currencyAmountRounded * 10) / 10
                            };
                            return evaluateItem;
                        }))
                    ))
                )
            )
        );
        return forkJoin(result);
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
