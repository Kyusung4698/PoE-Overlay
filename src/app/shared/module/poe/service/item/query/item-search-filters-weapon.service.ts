import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemSearchFiltersService, Language } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersWeaponService implements ItemSearchFiltersService {
    public add(item: Item, language: Language, query: Query): void {
        query.filters.weapon_filters = {
            filters: {}
        };

        const damage = item.damage;
        if (damage) {
            if (damage.dps) {
                query.filters.weapon_filters.filters.dps = {
                    min: damage.dps
                };
            }
            if (damage.edps) {
                query.filters.weapon_filters.filters.edps = {
                    min: damage.edps
                };
            }
            if (damage.pdps) {
                query.filters.weapon_filters.filters.pdps = {
                    min: damage.pdps
                };
            }
        }

        const prop = item.properties;
        if (prop) {
            if (prop.weaponAttacksPerSecond) {
                query.filters.weapon_filters.filters.aps = {
                    min: +prop.weaponAttacksPerSecond.value
                };
            }

            if (prop.weaponCriticalStrikeChance) {
                query.filters.weapon_filters.filters.crit = {
                    min: +(prop.weaponCriticalStrikeChance.value.replace('%', ''))
                };
            }
        }
    }
}
