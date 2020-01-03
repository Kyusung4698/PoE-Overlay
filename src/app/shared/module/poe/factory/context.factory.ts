import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaguesProvider } from '../provider/leagues.provider';
import { Context } from '../type';

@Injectable({
    providedIn: 'root'
})
export class ContextFactory {
    constructor(private readonly leaguesProvider: LeaguesProvider) { }

    public create(context: Context): Observable<Context> {
        return this.leaguesProvider.provide(context.language).pipe(
            map(leagues => {
                const result: Context = {
                    leagueId: leagues[0].id,
                    ...context,
                };
                const selectedLeague = leagues.find(league => league.id === result.leagueId);
                if (!selectedLeague) {
                    result.leagueId = leagues[0].id;
                }
                return result;
            })
        );
    }
}
