import { Injectable } from '@angular/core';
import * as PoE from '@data/poe';
import { League } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LeaguesProvider {
    private leagues: BehaviorSubject<League[]>;

    constructor(
        private readonly tradeHttpService: PoE.TradeHttpService) { }

    public provide(): Observable<League[]> {
        if (this.leagues) {
            return this.leagues.pipe(
                filter(leagues => !!leagues),
                take(1));
        }
        this.leagues = new BehaviorSubject<League[]>(undefined);
        return this.fetch();
    }

    private fetch(): Observable<League[]> {
        return this.tradeHttpService.getLeagues()
            .pipe(
                map(leagues => leagues.result.map(league => {
                    const result: League = {
                        id: league.id,
                        text: league.text
                    };
                    return result;
                })),
                tap(leagues => this.leagues.next([...leagues]))
            );
    }
}
