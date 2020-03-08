import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersArmourService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        const prop = item.properties;
        if (!prop) {
            return;
        }

        query.filters.armour_filters = {
            filters: {}
        };

        if (prop.armourArmour) {
            query.filters.armour_filters.filters.ar = {
                min: +prop.armourArmour.value
            };
        }
        if (prop.armourEvasionRating) {
            query.filters.armour_filters.filters.ev = {
                min: +prop.armourEvasionRating.value
            };
        }
        if (prop.armourEnergyShield) {
            query.filters.armour_filters.filters.es = {
                min: +prop.armourEnergyShield.value
            };
        }
        if (prop.shieldBlockChance) {
            query.filters.armour_filters.filters.block = {
                min: +prop.shieldBlockChance.value
            };
        }
    }
}
