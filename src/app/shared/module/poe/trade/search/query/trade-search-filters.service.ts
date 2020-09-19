import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterArmourService } from './trade-search-filter-armour.service';
import { TradeSearchFilterHeistService } from './trade-search-filter-heist.service';
import { TradeSearchFilterMapService } from './trade-search-filter-map.service';
import { TradeSearchFilterMiscsService } from './trade-search-filter-miscs.service';
import { TradeSearchFilterRequirementsService } from './trade-search-filter-requirements.service';
import { TradeSearchFilterSocketsService } from './trade-search-filter-sockets.service';
import { TradeSearchFilterStatsService } from './trade-search-filter-stats.service';
import { TradeSearchFilterTypeService } from './trade-search-filter-type.service';
import { TradeSearchFilterWeaponService } from './trade-search-filter-weapon.service';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFiltersService {
    private readonly filters: TradeSearchFilterService[];

    constructor(
        type: TradeSearchFilterTypeService,
        sockets: TradeSearchFilterSocketsService,
        weapon: TradeSearchFilterWeaponService,
        armour: TradeSearchFilterArmourService,
        requirements: TradeSearchFilterRequirementsService,
        miscs: TradeSearchFilterMiscsService,
        map: TradeSearchFilterMapService,
        stats: TradeSearchFilterStatsService,
        heist: TradeSearchFilterHeistService) {
        this.filters = [
            type, sockets, weapon, armour,
            requirements, miscs, map, stats, heist
        ];
    }

    public apply(item: Item, language: Language, query: TradeSearchHttpQuery): void {
        this.filters.forEach(filter => filter.add(item, language, query));
    }
}
