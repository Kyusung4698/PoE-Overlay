import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { Language, LanguageMap, League } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const CACHE_SIZE = 1;

@Injectable({
    providedIn: 'root'
})
export class LeaguesProvider {
    private readonly languageMap: LanguageMap<Observable<League[]>> = {};

    constructor(private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(language: Language): Observable<League[]> {
        return this.languageMap[language] || (
            this.languageMap[language] = this.fetch(language).pipe(shareReplay(CACHE_SIZE))
        );
    }

    private fetch(language: Language): Observable<League[]> {
        return this.tradeHttpService.getLeagues(language)
            .pipe(
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
