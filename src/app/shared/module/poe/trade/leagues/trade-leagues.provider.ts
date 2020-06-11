import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { League } from './trade-leagues';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class TradeLeaguesProvider {
    constructor(
        private readonly trade: TradeHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(language: Language): Observable<League[]> {
        const key = `trade_leagues_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<League[]> {
        return this.trade.getLeagues(language).pipe(
            map(response => response.result.map(league => {
                const result: League = {
                    id: league.id,
                    text: league.text
                };
                return result;
            })),
        );
    }
}
