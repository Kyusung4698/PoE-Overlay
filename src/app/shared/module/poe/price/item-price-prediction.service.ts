import { Injectable } from '@angular/core';
import { ItemPricePredictionHttpService } from '@data/poe-prices';
import { Language } from '@data/poe/schema';
import { forkJoin, Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ContextService } from '../context';
import { CurrencyConverterService, CurrencySelectService, CurrencySelectStrategy } from '../currency';
import { Item } from '../item';
import { ItemPricePredictionFeedback, ItemPricePredictionResult, ItemPricePredictionResultId } from './item-price-prediction';
import { ItemPricePredictionProvider } from './item-price-prediction.provider';

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionService {
    constructor(
        private readonly context: ContextService,
        private readonly http: ItemPricePredictionHttpService,
        private readonly prediction: ItemPricePredictionProvider,
        private readonly currencyConverter: CurrencyConverterService,
        private readonly currencySelect: CurrencySelectService) { }

    public predict(item: Item, currencies: string[], leagueId?: string): Observable<ItemPricePredictionResult> {
        leagueId = leagueId || this.context.get().leagueId;

        // TODO: translate item source
        const language = this.context.get().language;
        if (language !== Language.English) {
            return throwError('evaluate.prediction.language');
        }

        const { content } = item;
        return this.prediction.provide(leagueId, content).pipe(
            mergeMap(prediction => forkJoin(
                currencies.map(currency => this.currencyConverter.getConversionRate(prediction.currencyId, currency))
            ).pipe(map(factors => {
                const { min, max, url } = prediction;
                const values = factors.map(factor => [min * factor, max * factor]);
                const index = this.currencySelect.select(values, CurrencySelectStrategy.MinWithAtleast1);
                const { score, currency } = prediction;
                const result: ItemPricePredictionResult = {
                    url,
                    id: {
                        content, leagueId,
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
            id.leagueId, id.content, feedback,
            id.min, id.max, id.currency
        ).pipe(
            map(response => response === feedback)
        );
    }
}
