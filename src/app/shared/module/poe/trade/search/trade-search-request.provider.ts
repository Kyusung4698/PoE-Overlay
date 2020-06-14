import { Injectable } from '@angular/core';
import { Item } from '../../item';
import { TradeSearchFiltersService } from './query/trade-search-filters.service';
import { TradeSearchRequest } from './trade-search';
import { TradeSearchIndexed, TradeSearchOptions } from './trade-search-options';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchRequestProvider {

    constructor(private readonly filters: TradeSearchFiltersService) { }

    public provide(item: Item, options: TradeSearchOptions): TradeSearchRequest {
        const request: TradeSearchRequest = {
            sort: {
                price: 'asc',
            },
            query: {
                status: {
                    option: options.online ? 'online' : 'any',
                },
                filters: {
                    trade_filters: {
                        filters: {
                            sale_type: {
                                option: 'priced'
                            }
                        }
                    }
                },
                stats: []
            }
        };

        const { indexed } = options;
        if (indexed) {
            request.query.filters.trade_filters.filters.indexed = {
                option: indexed === TradeSearchIndexed.AnyTime ? null : indexed
            };
        }

        this.filters.apply(item, options.language, request.query);
        return request;
    }
}
