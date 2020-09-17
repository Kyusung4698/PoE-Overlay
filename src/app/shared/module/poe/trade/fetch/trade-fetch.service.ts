import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { b64DecodeUnicode } from '@app/helper';
import { TradeFetchHttpResult } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import moment from 'moment';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { TradeFetchListingStatus, TradeFetchRequest, TradeFetchResponse, TradeFetchResultEntry } from './trade-fetch';

const MAX_FETCH_PER_REQUEST_COUNT = 10;
const MAX_FETCH_PER_EXCHANGE_REQUEST_COUNT = 20;
const CACHE_EXPIRY = 1000 * 60 * 10;
const CACHE_PREFIX = 'trade_fetch';

@Injectable({
    providedIn: 'root'
})
export class TradeFetchService {

    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public fetch(request: TradeFetchRequest, start: number, end: number, exchange: boolean = false): Observable<TradeFetchResponse> {
        const { total, url } = request;
        const ids = request.ids.slice(start, end);
        if (!ids.length) {
            return of({ entries: [], url, total });
        }

        const locals$ = ids.map(id => {
            const key = `${CACHE_PREFIX}_${exchange}_${id}`;
            return this.cache.retrieve<TradeFetchHttpResult>(key).pipe(
                map(value => ({ id, value }))
            );
        });

        return this.cache.clear(CACHE_PREFIX).pipe(
            mergeMap(() => forkJoin(locals$)),
            mergeMap(locals => {
                const missing = locals.filter(x => !x.value).map(x => x.id);
                const cached = locals.filter(x => x.value).map(x => x.value);

                const chunkSize = !exchange
                    ? MAX_FETCH_PER_REQUEST_COUNT
                    : MAX_FETCH_PER_EXCHANGE_REQUEST_COUNT;
                const chunks = [];

                while (missing.length > 0) {
                    chunks.push(missing.splice(0, chunkSize));
                }

                const { id, language } = request;
                return from(chunks).pipe(
                    mergeMap(chunk => this.trade.fetch(chunk, id, language, exchange)),
                    toArray(),
                    map(responses => responses
                        .filter(x => x.result?.length)
                        .reduce<TradeFetchHttpResult[]>((a, b) => a.concat(b.result), cached)
                        .filter(x => x?.id?.length)
                        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
                    ),
                    map(results => results.map(result => {
                        const key = `${CACHE_PREFIX}_${exchange}_${result.id}`;
                        return this.cache.store(key, result, CACHE_EXPIRY);
                    })),
                    map(results => this.map(results, url, total, exchange))
                );
            })
        );
    }

    private map(results: TradeFetchHttpResult[], url: string, total: number, checkExchange: boolean): TradeFetchResponse {
        const entries = results.filter(result => {
            if (!result?.listing) {
                console.log(`Listing was null or undefined. ${JSON.stringify(result)}`, result);
                return false;
            }
            if (!moment(result.listing.indexed).isValid()) {
                console.log(`Indexed was not a valid date. ${JSON.stringify(result)}`, result);
                return false;
            }
            if (!result.listing.account?.name?.length) {
                console.log(`Account name was empty or undefined. ${JSON.stringify(result)}`, result);
                return false;
            }

            const { price } = result.listing;
            if (!price) {
                console.log(`Price was null or undefined. ${JSON.stringify(result)}`, result);
                return false;
            }

            if (checkExchange) {
                const { exchange } = price;
                if (!exchange) {
                    console.log(`Price exchange was null or undefined. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (!exchange.currency?.length) {
                    console.log(`Price exchange currency was empty or undefined. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (exchange.amount === null || exchange.amount === undefined || exchange.amount === 0) {
                    console.log(`Price exchange amount was null or undefined or zero. ${JSON.stringify(result)}`, result);
                    return false;
                }
                const { item } = price;
                if (!item) {
                    console.log(`Price item was null or undefined. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (!item.currency?.length) {
                    console.log(`Price item currency was empty or undefined. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (item.amount === null || item.amount === undefined || item.amount <= 0) {
                    console.log(`Price item amount was null or undefined or zero. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (item.stock === null || item.stock === undefined || item.stock <= 0) {
                    console.log(`Price item stock was null or undefined or zero. ${JSON.stringify(result)}`, result);
                    return false;
                }
            } else {
                if (price.amount === null || price.amount === undefined || price.amount <= 0) {
                    console.log(`Price amount was null or undefined or zero. ${JSON.stringify(result)}`, result);
                    return false;
                }
                if (!price.currency?.length) {
                    console.log(`Price currency was empty or undefined. ${JSON.stringify(result)}`, result);
                    return false;
                }
            }

            if (!result.item?.icon?.length) {
                console.log(`Item icon was empty or undefined. ${JSON.stringify(result)}`, result);
                return false;
            }
            return true;
        }).map(({ id, listing, item }) => {
            const { account, price, whisper } = listing;
            const { hashes, text } = item.extended || {};
            const { online } = account;
            let status = TradeFetchListingStatus.Offline;
            if (online) {
                status = online.status === 'afk'
                    ? TradeFetchListingStatus.Afk
                    : TradeFetchListingStatus.Online;
            }
            const indexed = moment(listing.indexed);
            const result: TradeFetchResultEntry = {
                id,
                listing: {
                    seller: account.name,
                    status,
                    whisper,
                    indexed,
                    age: indexed.fromNow(),
                    price: {
                        amount: price.amount,
                        currency: price.currency,
                        exchange: price.exchange,
                        item: price.item
                    }
                },
                item: {
                    icon: item.icon.replace(/\\/g, ''),
                    width: item.w,
                    height: item.h,
                    text: text ? b64DecodeUnicode(text) : '',
                    hashes: Object
                        .getOwnPropertyNames(hashes || {})
                        .reduce((a, b) => a.concat(hashes[b].map(([hash]) => hash)), [])
                }
            };
            return result;
        });
        return { entries, url, total };
    }
}
