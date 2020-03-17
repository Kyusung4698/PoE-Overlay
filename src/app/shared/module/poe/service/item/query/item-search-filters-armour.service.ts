import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersArmourService implements ItemSearchFiltersService {
    public add(item: Item, _: Language, query: Query): void {
        if (!item.properties) {
            return;
        }

        query.filters.armour_filters = {
            filters: {}
        };

        const { armourArmour } = item.properties;
        if (armourArmour) {
            const { value } = armourArmour;
            query.filters.armour_filters.filters.ar = {
                min: value.min, max: value.max
            };
        }
        const { armourEvasionRating } = item.properties;
        if (armourEvasionRating) {
            const { value } = armourEvasionRating;
            query.filters.armour_filters.filters.ev = {
                min: value.min, max: value.max
            };
        }
        const { armourEnergyShield } = item.properties;
        if (armourEnergyShield) {
            const { value } = armourEnergyShield;
            query.filters.armour_filters.filters.es = {
                min: value.min, max: value.max
            };
        }
        const { shieldBlockChance } = item.properties;
        if (shieldBlockChance) {
            const { value } = shieldBlockChance;
            query.filters.armour_filters.filters.block = {
                min: value.min, max: value.max
            };
        }
    }
}
