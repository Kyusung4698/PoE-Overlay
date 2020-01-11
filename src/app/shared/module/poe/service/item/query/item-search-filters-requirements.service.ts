import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersRequirementsService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        const req = item.requirements;
        if (!req) {
            return;
        }

        query.filters.req_filters = {
            filters: {}
        };

        if (req.level) {
            query.filters.req_filters.filters.lvl = {
                min: req.level
            };
        }
        if (req.str) {
            query.filters.req_filters.filters.str = {
                min: req.str
            };
        }
        if (req.dex) {
            query.filters.req_filters.filters.dex = {
                min: req.dex
            };
        }
        if (req.int) {
            query.filters.req_filters.filters.int = {
                min: req.int
            };
        }
    }
}
