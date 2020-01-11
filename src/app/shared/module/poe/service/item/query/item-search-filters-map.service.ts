import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersMapService implements ItemSearchFiltersService {
    public add(item: Item, query: Query): void {
        if (!item.properties) {
            return;
        }

        query.filters.map_filters = {
            filters: {}
        };

        const prop = item.properties;
        if (prop.mapTier) {
            query.filters.map_filters.filters.map_tier = {
                min: +prop.mapTier.value,
                max: +prop.mapTier.value
            };
        }

        if (prop.mapQuantity) {
            query.filters.map_filters.filters.map_iiq = {
                min: +prop.mapQuantity.value.replace('%', '').replace('+', ''),
            };
        }

        if (prop.mapRarity) {
            query.filters.map_filters.filters.map_iir = {
                min: +prop.mapRarity.value.replace('%', '').replace('+', ''),
            };
        }

        if (prop.mapPacksize) {
            query.filters.map_filters.filters.map_packsize = {
                min: +prop.mapPacksize.value.replace('%', '').replace('+', ''),
            };
        }
    }
}
