import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Context } from '../type';
import { LeaguesProvider } from '../provider/league/leagues.provider';

@Injectable({
    providedIn: 'root'
})
export class ContextFactory {
    constructor(private readonly leaguesProvider: LeaguesProvider) { }

    public create(context?: Context): Observable<Context> {
        return this.leaguesProvider.provide().pipe(
            map(leagues => {
                const result: Context = {
                    leagueId: leagues[0].id,
                    language: 'en',
                    ...context,
                };
                return result;
            })
        );
    }
}
