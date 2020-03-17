import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersWeaponService implements ItemSearchFiltersService {
    public add(item: Item, _: Language, query: Query): void {
        query.filters.weapon_filters = {
            filters: {}
        };

        const { damage } = item;
        if (damage) {
            const { dps, edps, pdps } = damage;
            if (dps) {
                query.filters.weapon_filters.filters.dps = {
                    min: dps.min, max: dps.max
                };
            }
            if (edps) {
                query.filters.weapon_filters.filters.edps = {
                    min: edps.min, max: edps.max
                };
            }
            if (pdps) {
                query.filters.weapon_filters.filters.pdps = {
                    min: pdps.min, max: pdps.max
                };
            }
        }

        if (item.properties) {
            const { weaponAttacksPerSecond } = item.properties;
            if (weaponAttacksPerSecond) {
                const { value } = weaponAttacksPerSecond;
                query.filters.weapon_filters.filters.aps = {
                    min: value.min, max: value.max
                };
            }

            const { weaponCriticalStrikeChance } = item.properties;
            if (weaponCriticalStrikeChance) {
                const { value } = weaponCriticalStrikeChance;
                query.filters.weapon_filters.filters.crit = {
                    min: value.min, max: value.max
                };
            }
        }
    }
}
