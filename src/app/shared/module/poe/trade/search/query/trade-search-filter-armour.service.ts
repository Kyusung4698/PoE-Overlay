import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterArmourService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        if (!item.properties) {
            return;
        }

        query.filters.armour_filters = {
            filters: {}
        };

        const { armourArmour } = item.properties;
        if (armourArmour) {
            const { min, max } = armourArmour;
            query.filters.armour_filters.filters.ar = { min, max };
        }
        const { armourEvasionRating } = item.properties;
        if (armourEvasionRating) {
            const { min, max } = armourEvasionRating;
            query.filters.armour_filters.filters.ev = { min, max };
        }
        const { armourEnergyShield } = item.properties;
        if (armourEnergyShield) {
            const { min, max } = armourEnergyShield;
            query.filters.armour_filters.filters.es = { min, max };
        }
        const { shieldBlockChance } = item.properties;
        if (shieldBlockChance) {
            const { min, max } = shieldBlockChance;
            query.filters.armour_filters.filters.block = { min, max };
        }
    }
}
