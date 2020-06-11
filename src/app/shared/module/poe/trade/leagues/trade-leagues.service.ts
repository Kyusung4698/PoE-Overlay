import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { ContextService } from '../../context';
import { League } from './trade-leagues';
import { TradeLeaguesProvider } from './trade-leagues.provider';

@Injectable({
    providedIn: 'root'
})
export class TradeLeaguesService {
    constructor(
        private readonly context: ContextService,
        private readonly leaguesProvider: TradeLeaguesProvider) { }

    public get(language?: Language): Observable<League[]> {
        language = language || this.context.get().language;
        return this.leaguesProvider.provide(language);
    }
}
