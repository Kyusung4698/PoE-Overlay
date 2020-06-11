import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item, ItemSocketsService } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterSocketsService implements TradeSearchFilterService {

    constructor(private readonly sockets: ItemSocketsService) { }

    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        const validSockets = (item.sockets || []).filter(x => !!x);
        if (validSockets.length <= 0) {
            return;
        }

        query.filters.socket_filters = {
            filters: {}
        };

        // ignore color for now. just count and linked count.

        const { length } = validSockets.filter(x => !!x.color);
        if (length > 0) {
            query.filters.socket_filters.filters.sockets = { min: length };
        }
        const links = this.sockets.getLinkCount(validSockets);
        if (links > 0) {
            query.filters.socket_filters.filters.links = { min: links };
        }
    }
}
