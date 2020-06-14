import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { TradeHttpService } from '@data/poe/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContextService } from '../../context';
import { TradeExchangeRequest, TradeExchangeResponse } from './trade-exchange';

@Injectable({
    providedIn: 'root'
})
export class TradeExchangeService {
    constructor(
        private readonly context: ContextService,
        private readonly trade: TradeHttpService) { }

    public search(request: TradeExchangeRequest, language?: Language, leagueId?: string): Observable<TradeExchangeResponse> {
        language = language || this.context.get().language;
        leagueId = leagueId || this.context.get().leagueId;

        return this.trade.exchange(request, language, leagueId).pipe(
            map(response => {
                const { id, url, total } = response;
                const result: TradeExchangeResponse = {
                    id, url, total,
                    language, ids: response.result || []
                };
                return result;
            })
        );
    }
}
