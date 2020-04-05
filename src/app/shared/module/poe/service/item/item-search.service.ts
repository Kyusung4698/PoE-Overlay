import { Injectable } from '@angular/core';
import { CacheService, LoggerService } from '@app/service';
import { TradeFetchResult, TradeHttpService, TradeSearchRequest } from '@data/poe';
import { Currency, Item, Language } from '@shared/module/poe/type';
import moment from 'moment';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { ItemSearchIndexed, ItemSearchOptions } from '../../type/search.type';
import { ContextService } from '../context.service';
import { CurrencyService } from '../currency/currency.service';
import { ItemSearchQueryService } from './query/item-search-query.service';

const MAX_FETCH_PER_REQUEST_COUNT = 10;
const MAX_FETCH_CONCURRENT_COUNT = 5;
const CACHE_EXPIRY = 1000 * 60 * 10;

export interface ItemSearchListing {
    seller: string;
    indexed: moment.Moment;
    age: string;
    currency: Currency;
    amount: number;
}

export interface ItemSearchResult {
    id: string;
    language: Language;
    url: string;
    total: number;
    hits: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ItemSearchService {
    constructor(
        private readonly context: ContextService,
        private readonly currencyService: CurrencyService,
        private readonly requestService: ItemSearchQueryService,
        private readonly tradeService: TradeHttpService,
        private readonly cache: CacheService,
        private readonly logger: LoggerService) { }

    public search(requestedItem: Item, options?: ItemSearchOptions): Observable<ItemSearchResult> {
        options = options || {};
        options.leagueId = options.leagueId || this.context.get().leagueId;
        options.language = options.language || this.context.get().language;

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
            }
        };

        const { indexed } = options;
        if (indexed) {
            request.query.filters.trade_filters.filters.indexed = {
                option: indexed === ItemSearchIndexed.AnyTime ? null : indexed
            };
        }

        const { language, leagueId } = options;
        this.requestService.map(requestedItem, language, request.query);

        return this.tradeService.search(request, language, leagueId).pipe(map(response => {
            const { id, url, total } = response;
            const result: ItemSearchResult = {
                id, language,
                url, total,
                hits: response.result || []
            };
            return result;
        }));
    }

    public list(search: ItemSearchResult, fetchCount: number): Observable<ItemSearchListing[]> {
        const { id, language, hits } = search;

        const maxFetchCount = Math.min(fetchCount, hits.length);
        const maxHits = hits.slice(0, maxFetchCount);
        if (maxHits.length <= 0) {
            return of([]);
        }

        const retrievedHits$ = maxHits.map(hit => {
            const key = `item_listing_${language}_${hit}`;
            return this.cache.retrieve<TradeFetchResult>(key).pipe(
                map(value => {
                    return { id: hit, value }
                })
            )
        });

        return this.cache.clear('item_listing_').pipe(
            flatMap(() => forkJoin(retrievedHits$)),
            flatMap(retrievedHits => {
                const hitsChunked: string[][] = [];

                const hitsMissing = retrievedHits.filter(x => !x.value).map(x => x.id);
                const hitsCached = retrievedHits.filter(x => x.value).map(x => x.value);

                this.logger.debug(
                    `missing hits: ${hitsMissing.length}, cached hits: ${hitsCached.length}` +
                    ` - saved: ${Math.round(hitsCached.length / maxHits.length * 100)}%`)

                for (let i = 0; i < hitsMissing.length; i += MAX_FETCH_PER_REQUEST_COUNT) {
                    hitsChunked.push(hitsMissing.slice(i, i + MAX_FETCH_PER_REQUEST_COUNT));
                }

                return from(hitsChunked).pipe(
                    mergeMap(chunk => this.tradeService.fetch(chunk, id, language), MAX_FETCH_CONCURRENT_COUNT),
                    toArray(),
                    flatMap(responses => {
                        const results: TradeFetchResult[] = responses
                            .filter(x => x.result && x.result.length)
                            .reduce((a, b) => a.concat(b.result), hitsCached);

                        if (results.length <= 0) {
                            return of([]);
                        }

                        const listings$ = results.map(result => {
                            const key = `item_listing_${language}_${result.id}`;
                            return this.cache.store(key, result, CACHE_EXPIRY).pipe(
                                flatMap(() => this.mapResult(result))
                            );
                        });

                        return forkJoin(listings$).pipe(
                            map(listings => listings.filter(x => x !== undefined))
                        );
                    })
                );
            })
        );
    }

    private mapResult(result: TradeFetchResult): Observable<ItemSearchListing> {
        if (!result || !result.listing || !result.listing.price || !result.listing.account || !result.listing.indexed) {
            this.logger.warn(`Result was invalid.`, result);
            return of(undefined);
        }

        const { listing } = result;

        const indexed = moment(listing.indexed);
        if (!indexed.isValid()) {
            this.logger.warn(`Indexed value: '${listing.indexed}' was not a valid date.`);
            return of(undefined);
        }

        const seller = listing.account.name || '';
        if (seller.length <= 0) {
            this.logger.warn(`Seller: '${seller}' was empty or undefined.`);
            return of(undefined);
        }

        const { price } = listing;
        const { amount } = price;
        if (amount <= 0) {
            this.logger.warn(`Amount was less or equal zero. Seller: ${seller}`);
            return of(undefined);
        }

        const currencyId = price.currency;
        return this.currencyService.searchById(currencyId).pipe(
            map(currency => {
                if (!currency) {
                    this.logger.warn(`Could not parse '${currencyId}' as currency.`);
                    return undefined;
                }
                return {
                    seller, indexed,
                    currency, amount,
                    age: indexed.fromNow(),
                };
            })
        );
    }
}

