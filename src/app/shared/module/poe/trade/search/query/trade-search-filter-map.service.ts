import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterMapService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        if (!item.properties) {
            return;
        }

        query.filters.map_filters = {
            filters: {}
        };

        const { mapTier } = item.properties;
        if (mapTier) {
            const { min, max, value } = mapTier;
            query.filters.map_filters.filters.map_tier = {
                min: min ? min : value,
                max: max ? max : value
            };
        }
        const { mapQuantity } = item.properties;
        if (mapQuantity) {
            const { min, max, value } = mapQuantity;
            query.filters.map_filters.filters.map_iiq = {
                min: min ? min : value,
                max: max ? max : value
            };
        }
        const { mapRarity } = item.properties;
        if (mapRarity) {
            const { min, max, value } = mapRarity;
            query.filters.map_filters.filters.map_iir = {
                min: min ? min : value,
                max: max ? max : value
            };
        }
        const { mapPacksize } = item.properties;
        if (mapPacksize) {
            const { min, max, value } = mapPacksize;
            query.filters.map_filters.filters.map_packsize = {
                min: min ? min : value,
                max: max ? max : value
            };
        }
    }
}
