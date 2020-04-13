import { Injectable } from '@angular/core';
import { cyrb53 } from '@app/function';
import { CacheService } from '@app/service';
import { ItemPricePredictionHttpService } from '@data/poe-prices';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

export interface ItemPricePrediction {
    min: number;
    max: number;
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
        private readonly cache: CacheService) { }

    public provide(leagueId: string, stringifiedItem: string): Observable<ItemPricePrediction> {
        const hash = cyrb53(stringifiedItem);
        const key = `${CACHE_PATH}${leagueId}_${hash}`;

        return this.cache.clear(CACHE_PATH).pipe(
            flatMap(() => this.cache.proxy(key, () => this.http.get(leagueId, stringifiedItem).pipe(
                map(response => {
                    const result: ItemPricePrediction = {
                        currencyId: response.currency,
                        max: response.max,
                        min: response.min,
                        score: response.pred_confidence_score
                    };
                    return result;
                })
            ), CACHE_EXPIRY))
        );
    }
}