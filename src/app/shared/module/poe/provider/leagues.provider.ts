import { Injectable } from '@angular/core';
import { CacheService } from '@app/service';
import * as PoE from '@data/poe';
import { Language, League } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const CACHE_EXPIRY = 1000 * 60 * 60;

@Injectable({
    providedIn: 'root'
})
export class LeaguesProvider {
    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService,
        private readonly cache: CacheService) { }

    public provide(language: Language): Observable<League[]> {
        const key = `leagues_${language}`;
        return this.cache.proxy(key, () => this.fetch(language), CACHE_EXPIRY);
    }

    private fetch(language: Language): Observable<League[]> {
        return this.tradeHttpService.getLeagues(language).pipe(
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
