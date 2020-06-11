import { Injectable } from '@angular/core';
import { ContextService } from '../../context';
import { Item } from '../../item';
import { TradeSearchRequest } from './trade-search';
import { TradeSearchOptions } from './trade-search-options';
import { TradeSearchRequestProvider } from './trade-search-request.provider';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchRequestService {
    constructor(
        private readonly request: TradeSearchRequestProvider,
        private readonly context: ContextService) { }

    public get(item: Item, options?: TradeSearchOptions): TradeSearchRequest {
        options = options || {};
        options.leagueId = options.leagueId || this.context.get().leagueId;
        options.language = options.language || this.context.get().language;
        return this.request.provide(item, options);
    }
}
