import { Injectable } from '@angular/core';
import { TradeFetchResult, TradeHttpService, TradeSearchRequest } from '@data/poe';
import { Item, ItemSearchResult, Language, SearchItem } from '@shared/module/poe/type';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { ItemSearchIndexed, ItemSearchOptions } from '../../type/search.type';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchQueryService } from './query/item-search-query.service';

const MAX_FETCH_COUNT = 10;
const MAX_FETCH_CONCURRENT_COUNT = 5;

@Injectable({
    providedIn: 'root'
})
export class ItemSearchService {
    constructor(
        private readonly context: ContextService,
        private readonly currencyService: CurrencyService,
        private readonly requestService: ItemSearchQueryService,
        private readonly tradeService: TradeHttpService) { }

    public search(requestedItem: Item, options?: ItemSearchOptions, language?: Language, leagueId?: string): Observable<ItemSearchResult> {
        leagueId = leagueId || this.context.get().leagueId;
        language = language || this.context.get().language;

        options = options || {};

        const request: TradeSearchRequest = {
            sort: {
                price: 'asc',
            },
            query: {
                status: {
                    option: options.online ? 'online' : 'any',
                },
                filters: {
                    trade_filters: {
                        filters: {
                            sale_type: {
                                option: 'priced'
                            }
                        }
                    }
                },
                stats: []
            },
        };
        if (options.indexed) {
            request.query.filters.trade_filters.filters.indexed = {
                option: options.indexed === ItemSearchIndexed.AnyTime ? null : options.indexed
            };
        }
        this.requestService.map(requestedItem, language, request.query);

        return this.tradeService.search(request, language, leagueId).pipe(
            flatMap(response => {
                if (response.total <= 0 || !response.result || !response.result.length) {
                    const result: ItemSearchResult = {
                        items: [],
                        url: response.url,
                        total: response.total,
                    };
                    return of(result);
                }

                const itemIds = response.result;
                const itemIdsChunked = [];

                for (let i = 0, j = Math.min(100, itemIds.length); i < j; i += MAX_FETCH_COUNT) {
                    itemIdsChunked.push(itemIds.slice(i, i + MAX_FETCH_COUNT));
                }

                return from(itemIdsChunked).pipe(
                    mergeMap(x => this.tradeService.fetch(x, response.id, language), MAX_FETCH_CONCURRENT_COUNT),
                    toArray(),
                    flatMap(responses => {
                        const items = responses.filter(x => x.result && x.result.length).reduce((a, b) => a.concat(b.result), []);
                        if (items.length <= 0) {
                            const result: ItemSearchResult = {
                                items: [],
                                url: response.url,
                                total: response.total,
                            };
                            return of(result);
                        }

                        const items$ = items
                            .map(item => this.createSearchItem(requestedItem, item));

                        return forkJoin(items$).pipe(
                            map(x => {
                                const result: ItemSearchResult = {
                                    items: x.filter(item => item !== undefined),
                                    url: response.url,
                                    total: response.total,
                                };
                                return result;
                            })
                        );
                    })
                );
            })
        );
    }

    private createSearchItem(requestedItem: Item, result: TradeFetchResult): Observable<SearchItem> {
        if (!result || !result.listing || !result.listing.price) {
            return of(undefined);
        }

        const price = result.listing.price;

        const currencyAmount = price.amount;
        if (currencyAmount <= 0) {
            return of(undefined);
        }

        const currencyId = price.currency;
        return this.currencyService.searchById(currencyId).pipe(
            map(currency => {
                if (!currency) {
                    console.warn(`Could not parse '${currencyId}' as currency.`);
                    return undefined;
                }

                const item: SearchItem = {
                    ...requestedItem,
                    currency,
                    currencyAmount
                };
                return item;
            })
        );
    }
}
