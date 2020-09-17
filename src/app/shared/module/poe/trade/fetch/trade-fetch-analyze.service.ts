import { Injectable } from '@angular/core';
import moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CurrencyConverterService, CurrencySelectService, CurrencySelectStrategy } from '../../currency';
import { TradeFetchResponse, TradeFetchResultEntry } from './trade-fetch';
import { TradeFetchAnalyzeEntry, TradeFetchAnalyzeEntryGrouped, TradeFetchAnalyzeResult } from './trade-fetch-analyze';

@Injectable({
    providedIn: 'root'
})
export class TradeFetchAnalyzeService {

    constructor(
        private readonly converter: CurrencyConverterService,
        private readonly selector: CurrencySelectService) { }

    public analyze(response: TradeFetchResponse, currencies: string[]): Observable<TradeFetchAnalyzeResult> {
        return this.convert(currencies, response.entries).pipe(
            map(converted => this.findMinCurrencyWithAtleast1(converted)),
            map(entries => {
                const { total, url } = response;
                if (!entries?.length) {
                    const empty: TradeFetchAnalyzeResult = {
                        entries, url, total
                    };
                    return empty;
                }
                return this.calculateMetrics(entries, url, total);
            })
        );
    }

    private calculateMetrics(entries: TradeFetchAnalyzeEntry[], url: string, total: number): TradeFetchAnalyzeResult {
        const sortedByAmount = entries.sort((a, b) => a.targetAmount - b.targetAmount);

        const min = sortedByAmount[0].targetAmount;
        const max = sortedByAmount[sortedByAmount.length - 1].targetAmount;

        const sortedByAmountRounded = entries.sort((a, b) => a.targetAmountRounded - b.targetAmountRounded);
        const itemsGrouped: TradeFetchAnalyzeEntryGrouped[] = [
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
            const { seller, indexed } = item.fetch.listing;

            const index = itemsGrouped.length - 1;
            if (itemsGrouped[index].value === item.targetAmountRounded) {
                if (!sellerGroup[seller]) {
                    itemsGrouped[index].items.push(item);
                    meanGroup += now.diff(indexed);
                    sellerGroup[seller] = 1;
                } else {
                    if (++sellerGroup[seller] <= 3) {
                        itemsGrouped[index].items.push(item);
                        meanGroup += now.diff(indexed);
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

                meanGroup = now.diff(indexed);
                itemsGrouped.push({
                    value: item.targetAmountRounded,
                    items: [item],
                    hidden: 0,
                });
                sellerGroup = {
                    [seller]: 1
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

        const result: TradeFetchAnalyzeResult = {
            url,
            total,
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

    private convert(currencies: string[], entries: TradeFetchResultEntry[]): Observable<TradeFetchAnalyzeEntry[][]> {
        if (!entries.length) {
            return of([[]]);
        }

        // TODO: Support Bulk Exchange

        const entries$ = currencies.map(currency =>
            this.converter.getConversionRate('chaos', currency).pipe(
                mergeMap(currencyChaosFactor => forkJoin(
                    entries.map(fetch => forkJoin([
                        this.converter.getConversionRate(fetch.listing.price.currency, 'chaos'),
                        this.converter.getConversionRate(fetch.listing.price.currency, currency)
                    ]).pipe(
                        map(([chaosFactor, currencyFactor]) => {
                            const chaosAmount = fetch.listing.price.amount * chaosFactor;
                            const chaosAmountRounded = this.round(chaosAmount);

                            const currencyAmount = fetch.listing.price.amount * currencyFactor;
                            const currencyAmountRounded = chaosAmountRounded * currencyChaosFactor;

                            const entry: TradeFetchAnalyzeEntry = {
                                fetch,
                                target: currency,
                                targetAmount: currencyAmount,
                                targetAmountRounded: Math.round(currencyAmountRounded * 10) / 10
                            };
                            return entry;
                        }))
                    ))
                )
            )
        );
        return forkJoin(entries$);
    }

    private findMinCurrencyWithAtleast1(entries: TradeFetchAnalyzeEntry[][]): TradeFetchAnalyzeEntry[] {
        if (entries.length === 1) {
            return entries[0];
        }
        const values = entries.map(x => x.map(y => y.targetAmount));
        const index = this.selector
            .select(values, CurrencySelectStrategy.MinWithAtleast1);
        return entries[index];
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
