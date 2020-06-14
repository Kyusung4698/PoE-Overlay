import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterWeaponService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        query.filters.weapon_filters = {
            filters: {}
        };

        const { damage } = item;
        if (damage) {
            const { dps, edps, pdps } = damage;
            if (dps) {
                const { min, max } = dps;
                query.filters.weapon_filters.filters.dps = { min, max };
            }
            if (edps) {
                const { min, max } = edps;
                query.filters.weapon_filters.filters.edps = { min, max };
            }
            if (pdps) {
                const { min, max } = pdps;
                query.filters.weapon_filters.filters.pdps = { min, max };
            }
        }

        if (item.properties) {
            const { weaponAttacksPerSecond } = item.properties;
            if (weaponAttacksPerSecond) {
                const { min, max } = weaponAttacksPerSecond;
                query.filters.weapon_filters.filters.aps = { min, max };
            }

            const { weaponCriticalStrikeChance } = item.properties;
            if (weaponCriticalStrikeChance) {
                const { min, max } = weaponCriticalStrikeChance;
                query.filters.weapon_filters.filters.crit = { min, max };
            }
        }
    }
}
