import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TradeLeaguesProvider } from '../trade/leagues/trade-leagues.provider';
import { Context } from './context';

@Injectable({
    providedIn: 'root'
})
export class ContextFactory {
    constructor(private readonly leaguesProvider: TradeLeaguesProvider) { }

    public create(context: Context): Observable<Context> {
        return this.leaguesProvider.provide(context.language).pipe(
            catchError(error => {
                console.error(`Could not establish a connection to the GGG API: ${error?.message ?? JSON.stringify(error)}`);
                return of([
                    { id: 'Standard', text: 'Standard' },
                    { id: 'Hardcore', text: 'Hardcore' }
                ]);
            }),
            map(leagues => {
                const result: Context = {
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
