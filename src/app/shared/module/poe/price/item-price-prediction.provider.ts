import { Injectable } from '@angular/core';
import { cyrb53, StorageCacheService } from '@app/cache';
import { ItemPricePredictionHttpService } from '@data/poe-prices';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export interface ItemPricePrediction {
    url: string;
    min: number;
    max: number;
    currency: 'chaos' | 'exalt';
    currencyId: string;
    score: number;
}

const CACHE_PATH = 'item_price_';
const CACHE_EXPIRY = 1000 * 60 * 15;

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionProvider {
    constructor(
        private readonly http: ItemPricePredictionHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(leagueId: string, stringifiedItem: string): Observable<ItemPricePrediction> {
        const hash = cyrb53(stringifiedItem);
        const key = `${CACHE_PATH}${leagueId}_${hash}`;
        return this.cache.clear(CACHE_PATH).pipe(
            mergeMap(() => this.cache.proxy(key, () =>
                this.http.get(leagueId, stringifiedItem).pipe(
                    map(response => {
                        const currencyId = response.currency === 'exalt' ? 'exa' : response.currency;
                        const result: ItemPricePrediction = {
                            url: response.url,
                            currencyId, currency: response.currency,
                            max: response.max, min: response.min,
                            score: response.pred_confidence_score
                        };
                        return result;
                    })
                ), CACHE_EXPIRY)
            )
        );
    }
}
