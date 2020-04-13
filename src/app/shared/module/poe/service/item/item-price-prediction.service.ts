import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ItemPricePredictionProvider } from '../../provider';
import { Currency, Item } from '../../type';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';

export interface ItemPricePredictionResult {
    currency: Currency;
    min: number;
    max: number;
    score: number;
}

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionService {

    constructor(
        private readonly context: ContextService,
        private readonly prediction: ItemPricePredictionProvider,
        private readonly currencyConverter: CurrencyConverterService,
        private readonly currencySelect: CurrencySelectService, ) { }

    public predict(item: Item, currencies: Currency[], leagueId?: string): Observable<ItemPricePredictionResult> {
        leagueId = leagueId || this.context.get().leagueId;

        // TODO: translate item source

        return this.prediction.provide(leagueId, item.source).pipe(
            flatMap(prediction =>
                forkJoin(currencies.map(currency =>
                    this.currencyConverter.convert(prediction.currencyId, currency.id))
                ).pipe(
                    map(factors => {
                        const { min, max } = prediction;
                        const values = factors.map(factor => [min * factor, max * factor]);
                        const index = this.currencySelect.select(values, CurrencySelectStrategy.MinWithAtleast1);
                        const result: ItemPricePredictionResult = {
                            currency: currencies[index],
                            min: Math.round(values[index][0] * 100) / 100,
                            max: Math.round(values[index][1] * 100) / 100,
                            score: prediction.score
                        };
                        return result;
                    })
                )
            )
        )
    }
}