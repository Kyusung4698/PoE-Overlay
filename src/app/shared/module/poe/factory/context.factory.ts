import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Context, Language } from '../type';
import { LeaguesProvider } from '../provider/leagues.provider';

@Injectable({
    providedIn: 'root'
})
export class ContextFactory {
    constructor(private readonly leaguesProvider: LeaguesProvider) { }

    public create(context?: Context): Observable<Context> {
        return this.leaguesProvider.provide(Language.French).pipe(
            map(leagues => {
                const result: Context = {
                    leagueId: leagues[0].id,
                    language: leagues[0].language,
                    ...context,
                };
                return result;
            })
        );
    }
}
