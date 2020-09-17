import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ContextService } from '../context';
import { CurrencyConverterService, CurrencySelectService, CurrencySelectStrategy } from '../currency';
import { Item, ItemSocketsService } from '../item';
import { BaseItemTypeService } from '../item/base-item-type';
import { WordService } from '../item/word';
import { ItemPriceRate } from './item-price-rates';
import { ItemPriceRatesProvider } from './item-price-rates.provider';

export interface ItemPriceRateResult {
    currency?: string;
    amount?: number;
    inverseAmount?: number;
    factor?: number;
    change?: number;
    history?: number[];
    url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ItemPriceRateService {
    constructor(
        private readonly context: ContextService,
        private readonly rates: ItemPriceRatesProvider,
        private readonly sockets: ItemSocketsService,
        private readonly currencyConverter: CurrencyConverterService,
        private readonly currencySelect: CurrencySelectService,
        private readonly baseItemTypeService: BaseItemTypeService,
        private readonly wordService: WordService) { }

    public get(item: Item, currencies: string[], leagueId?: string): Observable<ItemPriceRateResult> {
        leagueId = leagueId || this.context.get().leagueId;

        return this.getValue(leagueId, item).pipe(
            mergeMap(value => iif(() => !value,
                of(undefined),
                forkJoin(currencies.map(currency =>
                    this.currencyConverter.getConversionRate('chaos', currency))
                ).pipe(
                    map(factors => {
                        const values = factors.map(factor => [value.chaosAmount * factor]);
                        const index = this.currencySelect.select(values, CurrencySelectStrategy.MinWithAtleast1);
                        const size = (item.properties?.stackSize?.text?.split('/') || ['1'])[0];
                        const result: ItemPriceRateResult = {
                            amount: Math.ceil(values[index][0] * 100) / 100,
                            factor: +size.replace('.', ''),
                            inverseAmount: Math.ceil((1 / values[index][0]) * 100) / 100,
                            currency: currencies[index],
                            change: value.change,
                            history: value.history || [],
                            url: value.url,
                        };
                        return result;
                    })
                ))
            )
        );
    }

    private getValue(leagueId: string, item: Item): Observable<ItemPriceRate> {
        const links = this.sockets.getLinkCount(item.sockets);
        const filterLinks = (x: ItemPriceRate) => {
            if (x.links === undefined) {
                return true;
            }
            if (links > 4) {
                return x.links === links;
            }
            if (links >= 0) {
                return x.links === 0;
            }
            return false;
        };

        const tier = item.properties?.mapTier?.value;
        const filterMapTier = (x: ItemPriceRate) => {
            if (isNaN(tier) || x.links === undefined) {
                return true;
            }
            return x.mapTier === tier;
        };

        const findLowest = (value: number, ...array: number[]) => {
            const indexArr = array.map(x => value - x).filter(x => x >= 0);
            const min = Math.min.apply(Math, indexArr);
            return array[indexArr.indexOf(min)];
        };

        let gemLevel = item.properties?.gemLevel?.value;
        gemLevel = isNaN(gemLevel) ? NaN : findLowest(gemLevel, 1, 20, 21);
        const filterGemLevel = (x: ItemPriceRate) => {
            if (isNaN(gemLevel) || x.gemLevel === undefined) {
                return true;
            }
            return x.gemLevel === gemLevel;
        };

        let gemQuality = item.properties?.quality?.value;
        gemQuality = isNaN(gemLevel) ? NaN : findLowest(gemQuality, 0, 20, 23);
        const filterGemQuality = (x: ItemPriceRate) => {
            if (isNaN(gemQuality) || x.gemQuality === undefined) {
                return true;
            }
            return x.gemQuality === gemQuality;
        };

        const corrupted = !!item.corrupted;
        const filterCorrupted = (x: ItemPriceRate) => {
            if (x.corrupted === undefined) {
                return true;
            }
            return x.corrupted === corrupted;
        };

        const filter = (x: ItemPriceRate) => {
            return filterLinks(x) && filterMapTier(x) && filterGemLevel(x) && filterGemQuality(x) && filterCorrupted(x);
        };

        return this.rates.provide(leagueId, item.rarity, item.category).pipe(map(response => {
            const type = this.baseItemTypeService.translate(item.typeId, Language.English);
            const name = this.wordService.translate(item.nameId, Language.English);
            if (item.typeId && !item.nameId) {
                return response.rates.find(
                    x => x.name === type && filter(x));
            }
            return response.rates.find(
                x => x.name === name && x.type === type && !x.relic && filter(x));
        }));
    }
}
