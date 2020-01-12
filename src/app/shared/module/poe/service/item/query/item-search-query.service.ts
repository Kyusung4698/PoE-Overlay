import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '../../../type';
import { ItemSearchFiltersArmourService } from './item-search-filters-armour.service';
import { ItemSearchFiltersMapService } from './item-search-filters-map.service';
import { ItemSearchFiltersMiscsService } from './item-search-filters-miscs.service';
import { ItemSearchFiltersRequirementsService } from './item-search-filters-requirements.service';
import { ItemSearchFiltersSocketService } from './item-search-filters-socket.service';
import { ItemSearchFiltersStatsService } from './item-search-filters-stats.service';
import { ItemSearchFiltersTypeService } from './item-search-filters-type.service';
import { ItemSearchFiltersWeaponService } from './item-search-filters-weapon.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchQueryService {
    private readonly filters: ItemSearchFiltersService[];

    constructor(
        filtersTypeService: ItemSearchFiltersTypeService,
        filtersSocketService: ItemSearchFiltersSocketService,
        filtersWeaponService: ItemSearchFiltersWeaponService,
        filtersArmourService: ItemSearchFiltersArmourService,
        filtersRequirementsService: ItemSearchFiltersRequirementsService,
        filtersMiscsService: ItemSearchFiltersMiscsService,
        filtersMapService: ItemSearchFiltersMapService,
        filtersStatsService: ItemSearchFiltersStatsService) {
        this.filters = [
            filtersTypeService,
            filtersSocketService,
            filtersWeaponService,
            filtersArmourService,
            filtersRequirementsService,
            filtersMiscsService,
            filtersMapService,
            filtersStatsService
        ];
    }

    public map(item: Item, language: Language, query: Query) {
        this.filters.forEach(filter => filter.add(item, language, query));
    }
}
