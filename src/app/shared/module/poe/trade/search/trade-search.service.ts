import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../../context';
import { TradeSearchRequest, TradeSearchResponse } from './trade-search';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchService {
    constructor(
        private readonly context: ContextService,
        private readonly trade: TradeHttpService) { }

    public search(request: TradeSearchRequest, language?: Language, leagueId?: string): Observable<TradeSearchResponse> {
        language = language || this.context.get().language;
        leagueId = leagueId || this.context.get().leagueId;

        return this.trade.search(request, language, leagueId).pipe(
            map(response => {
                const { id, url, total } = response;
                const result: TradeSearchResponse = {
                    id, url, total,
                    language, ids: response.result || []
                };
                return result;
            })
        );
    }
}
