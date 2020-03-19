import { Injectable } from '@angular/core';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ItemCategoryValue, ItemCategoryValuesProvider } from '../../provider/item-category-values.provider';
import { Currency, Item, Language } from '../../type';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';
import { WordService } from '../word/word.service';
import { ItemSocketService } from './item-socket.service';

export class ItemExchangeRateResult {
    currency?: Currency;
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
export class ItemExchangeRateService {
    constructor(
        private readonly context: ContextService,
        private readonly valuesProvider: ItemCategoryValuesProvider,
        private readonly socket: ItemSocketService,
        private readonly currencyConverterService: CurrencyConverterService,
        private readonly currencySelectService: CurrencySelectService,
        private readonly baseItemTypesService: BaseItemTypesService,
        private readonly wordService: WordService) { }

    public get(item: Item, currencies: Currency[], leagueId?: string): Observable<ItemExchangeRateResult> {
        leagueId = leagueId || this.context.get().leagueId;

        return this.getValue(leagueId, item).pipe(
            flatMap(value => iif(() => !value,
                of(undefined),
                forkJoin(currencies.map(currency =>
                    this.currencyConverterService.convert('chaos', currency.id))
                ).pipe(
                    map(factors => {
                        const values = factors.map(factor => [value.chaosAmount * factor]);
                        const index = this.currencySelectService.select(values, CurrencySelectStrategy.MinWithAtleast1);
                        const result: ItemExchangeRateResult = {
                            amount: Math.ceil(values[index][0] * 100) / 100,
                            factor: +(item.properties?.stackSize?.value?.split('/') || [1])[0],
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

    private getValue(leagueId: string, item: Item): Observable<ItemCategoryValue> {
        const links = this.socket.getLinkCount(item.sockets);
        const filterLinks = (x: ItemCategoryValue) => {
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

        const tier = +item.properties?.mapTier?.value;
        const filterMapTier = (x: ItemCategoryValue) => {
            if (isNaN(tier) || x.links === undefined) {
                return true;
            }
            return x.mapTier === tier;
        };

        return this.valuesProvider.provide(leagueId, item.rarity, item.category).pipe(map(response => {
            const type = this.baseItemTypesService.translate(item.typeId, Language.English);
            const name = this.wordService.translate(item.nameId, Language.English);
            if (item.typeId && !item.nameId) {
                return response.values.find(
                    x => x.name === type && filterLinks(x) && filterMapTier(x));
            }
            return response.values.find(
                x => x.name === name && x.type === type && filterLinks(x) && filterMapTier(x));
        }));
    }
}
