import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';
import { ItemSocketService } from '../item-socket.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersSocketService implements ItemSearchFiltersService {

    constructor(
        private readonly socket: ItemSocketService) {
    }

    public add(item: Item, language: Language, query: Query): void {
        const validSockets = (item.sockets || []).filter(x => !!x);
        if (validSockets.length <= 0) {
            return;
        }

        query.filters.socket_filters = {
            filters: {}
        };

        // ignore color for now. just count and linked count.

        const sockets = validSockets.filter(x => !!x.color);
        if (sockets.length > 0) {
            query.filters.socket_filters.filters.sockets = {
                min: sockets.length
            };
        }

        const links = this.socket.getLinkCount(validSockets);
        if (links > 0) {
            query.filters.socket_filters.filters.links = { min: links };
        }
    }
}
