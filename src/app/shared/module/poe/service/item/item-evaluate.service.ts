import { Injectable } from '@angular/core';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ItemCategoryValue, ItemCategoryValuesProvider } from '../../provider/item-category-values.provider';
import { Currency, Item, Language } from '../../type';
import { BaseItemTypesService } from '../base-item-types/base-item-types.service';
import { ContextService } from '../context.service';
import { CurrencyConverterService } from '../currency/currency-converter.service';
import { CurrencySelectService, CurrencySelectStrategy } from '../currency/currency-select.service';
import { CurrencyService } from '../currency/currency.service';
import { WordService } from '../word/word.service';

export class ItemEvaluateResult {
    currency?: Currency;
    amount?: number;
    inverseAmount?: number;
    change?: number;
    history?: number[];
}

@Injectable({
    providedIn: 'root'
})
export class ItemEvaluateService {
    constructor(
        private readonly context: ContextService,
        private readonly valuesProvider: ItemCategoryValuesProvider,
        private readonly currencyService: CurrencyService,
        private readonly currencyConverterService: CurrencyConverterService,
        private readonly currencySelectService: CurrencySelectService,
        private readonly baseItemTypesService: BaseItemTypesService,
        private readonly wordService: WordService) { }

    public evaluate(item: Item, currencies: Currency[], leagueId?: string): Observable<ItemEvaluateResult> {
        leagueId = leagueId || this.context.get().leagueId;

        return this.getValue(leagueId, item).pipe(
            flatMap(value => iif(() => !value,
                of(undefined),
                this.currencyService.searchById('chaos').pipe(
                    flatMap(chaos => forkJoin(currencies.map(currency =>
                        this.currencyConverterService.convert(chaos, currency))
                    )),
                    map(factors => {
                        const values = factors.map(factor => [value.chaosAmount * factor]);
                        const index = this.currencySelectService.select(values, CurrencySelectStrategy.MinWithAtleast1);
                        const result: ItemEvaluateResult = {
                            amount: values[index][0],
                            inverseAmount: 1 / values[index][0],
                            currency: currencies[index],
                            change: value.change,
                            history: value.history || [],
                        };
                        return result;
                    })
                ))
            )
        );
    }

    private getValue(leagueId: string, item: Item): Observable<ItemCategoryValue> {
        let count = 0;
        let links = 0;
        (item.sockets || []).forEach(x => {
            if (x.linked) {
                ++count;
            }
            if (count > links) {
                links = count;
            }
            if (!x.linked) {
                count = 0;
            }
        });

        const filterLinks = (x: ItemCategoryValue) => {
            if (links > 4) {
                return x.links === links;
            }
            if (links > 0) {
                return x.links === 0;
            }
            return true;
        };

        return this.valuesProvider.provide(leagueId, item.rarity, item.category).pipe(map(response => {
            const type = this.baseItemTypesService.translate(item.typeId, Language.English);
            const name = this.wordService.translate(item.nameId, Language.English);
            if (item.typeId && !item.nameId) {
                return response.values.find(x => x.name === type && filterLinks(x));
            }
            return response.values.find(x => x.name === name && x.type === type && filterLinks(x));
        }));
    }
}
