import { Injectable } from '@angular/core';
import { ItemPricePredictionHttpService } from '@data/poe-prices';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ItemPricePredictionProvider } from '../../provider';
import { Currency, Item } from '../../type';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';

export interface ItemPricePredictionResult {
    id: ItemPricePredictionResultId;
    currency: Currency;
    min: number;
    max: number;
    score: number;
}

export interface ItemPricePredictionResultId {
    leagueId: string;
    source: string;
    currency: 'chaos' | 'exalt';
    min: number;
    max: number;
}

export enum ItemPricePredictionFeedback {
    Low = 'low',
    Fair = 'fair',
    High = 'high',
}

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionService {
    constructor(
        private readonly context: ContextService,
        private readonly http: ItemPricePredictionHttpService,
        private readonly prediction: ItemPricePredictionProvider,
        private readonly currencyConverter: CurrencyConverterService,
        private readonly currencySelect: CurrencySelectService, ) { }

    public predict(item: Item, currencies: Currency[], leagueId?: string): Observable<ItemPricePredictionResult> {
        leagueId = leagueId || this.context.get().leagueId;

        // TODO: translate item source
        const { source } = item;
        return this.prediction.provide(leagueId, source).pipe(
            flatMap(prediction => forkJoin(
                currencies.map(currency => this.currencyConverter.convert(prediction.currencyId, currency.id))
            ).pipe(map(factors => {
                const { min, max } = prediction;
                const values = factors.map(factor => [min * factor, max * factor]);
                const index = this.currencySelect.select(values, CurrencySelectStrategy.MinWithAtleast1);
                const { score, currency } = prediction;
                const result: ItemPricePredictionResult = {
                    id: {
                        source, leagueId,
                        currency, min, max
                    },
                    score, currency: currencies[index],
                    min: Math.round(values[index][0] * 100) / 100,
                    max: Math.round(values[index][1] * 100) / 100,
                };
                return result;
            })))
        );
    }

    public feedback(id: ItemPricePredictionResultId, feedback: ItemPricePredictionFeedback): Observable<boolean> {
        return this.http.post(
            id.leagueId, id.source, feedback,
            id.min, id.max, id.currency
        ).pipe(
            map(response => response === feedback)
        );
    }
}