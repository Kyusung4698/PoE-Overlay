import { Injectable } from '@angular/core';
import { Query, StatsFilter } from '@data/poe';
import { Item, ItemMod, ItemSearchFiltersService, Language } from '../../../type';
import { StatsDescriptionService } from '../../stats-description/stats-description.service';
import { StatsIdService } from '../../stats-id/stats-id.service';
import { ItemService } from '../item.service';
import { ItemSearchFiltersArmourService } from './item-search-filters-armour.service';
import { ItemSearchFiltersMapService } from './item-search-filters-map.service';
import { ItemSearchFiltersMiscsService } from './item-search-filters-miscs.service';
import { ItemSearchFiltersRequirementsService } from './item-search-filters-requirements.service';
import { ItemSearchFiltersSocketService } from './item-search-filters-socket.service';
import { ItemSearchFiltersTypeService } from './item-search-filters-type.service';
import { ItemSearchFiltersWeaponService } from './item-search-filters-weapon.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchQueryService {
    private readonly filters: ItemSearchFiltersService[];

    constructor(
        private readonly statsDescriptionService: StatsDescriptionService,
        private readonly statsIdService: StatsIdService,
        filtersTypeService: ItemSearchFiltersTypeService,
        filtersSocketService: ItemSearchFiltersSocketService,
        filtersWeaponService: ItemSearchFiltersWeaponService,
        filtersArmourService: ItemSearchFiltersArmourService,
        filtersRequirementsService: ItemSearchFiltersRequirementsService,
        filtersMiscsService: ItemSearchFiltersMiscsService,
        filtersMapService: ItemSearchFiltersMapService) {
        this.filters = [
            filtersTypeService,
            filtersSocketService,
            filtersWeaponService,
            filtersArmourService,
            filtersRequirementsService,
            filtersMiscsService,
            filtersMapService
        ];
    }

    public map(item: Item, language: Language, query: Query) {
        this.filters.forEach(filter => filter.add(item, language, query));

        // TODO: will be replaced soon
        this.mapStatsFilters(item, query);
    }

    private mapStatsFilters(item: Item, query: Query): void {
        const implicits = (item.implicits || []).filter(x => !!x);
        const explicits = (item.explicits || [])
            .filter(group => !!group)
            .reduce((a, group) => a.concat(group.filter(mod => !!mod)), []);

        if (implicits.length > 0 || explicits.length > 0) {
            query.stats = [
                {
                    type: 'and',
                    filters: []
                }
            ];

            if (implicits.length > 0) {
                this.mapMods(implicits, query, 'implicit');
            }
            if (explicits.length > 0) {
                this.mapMods(explicits, query, 'explicits');
            }
        }
    }

    private mapMods(mods: ItemMod[], query: Query, filter: string) {
        const texts = mods.map(mod => {
            return this.statsDescriptionService
                .translate(mod.key, mod.predicate, mod.values.map(x => '#'), Language.English);
        });

        const result = this.statsIdService.searchMultiple(texts);
        result.forEach((value, index) => {
            if (value && value.ids) {
                const filterId = value.ids.find(x => x.startsWith(filter));

                const id = filterId ? filterId : value.ids[0];
                const stat: StatsFilter = {
                    disabled: false,
                    id
                };
                const mod = mods[index];
                if (mod.values.length > 0) {
                    const min = +mod.values[0].replace('%', '');
                    if (!isNaN(min)) {
                        stat.value = { min };
                    }
                }
                query.stats[0].filters.push(stat);
            }
        });
    }
}
