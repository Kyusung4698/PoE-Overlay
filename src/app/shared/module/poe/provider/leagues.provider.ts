import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { Language, League, LanguageMap } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LeaguesProvider {
    private readonly languageMap: LanguageMap<BehaviorSubject<League[]>> = {};

    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(language: Language): Observable<League[]> {
        const leagues = this.languageMap[language];
        if (leagues) {
            return leagues.pipe(
                filter(result => !!result),
                take(1));
        }
        this.languageMap[language] = new BehaviorSubject<League[]>(undefined);
        return this.fetch(language);
    }

    private fetch(language: Language): Observable<League[]> {
        return this.tradeHttpService.getLeagues(language)
            .pipe(
                map(leagues => leagues.result.map(league => {
                    const result: League = {
                        id: league.id,
                        text: league.text
                    };
                    return result;
                })),
                tap(leagues => this.languageMap[language].next([...leagues]))
            );
    }
}
