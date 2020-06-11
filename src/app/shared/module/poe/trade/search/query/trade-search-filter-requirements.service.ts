import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterRequirementsService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        if (!item.requirements) {
            return;
        }

        query.filters.req_filters = {
            filters: {}
        };

        const { level } = item.requirements;
        if (level) {
            query.filters.req_filters.filters.lvl = { min: level };
        }
        const { str } = item.requirements;
        if (str) {
            query.filters.req_filters.filters.str = { min: str };
        }
        const { dex } = item.requirements;
        if (dex) {
            query.filters.req_filters.filters.dex = { min: dex };
        }
        const { int } = item.requirements;
        if (int) {
            query.filters.req_filters.filters.int = { min: int };
        }
    }
}
