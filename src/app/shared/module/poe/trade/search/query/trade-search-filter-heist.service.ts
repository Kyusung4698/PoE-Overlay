import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterHeistService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        if (!item.properties) {
            return;
        }

        query.filters.heist_filters = {
            filters: {}
        };

        const { heistAreaLevel } = item.properties;
        if (heistAreaLevel) {
            const { min, max } = heistAreaLevel;
            query.filters.heist_filters.filters.area_level = {
                min, max
            };
        }

        const { heistWingsRevealed } = item.properties;
        if (heistWingsRevealed) {
            const { min, max, value } = heistWingsRevealed;
            query.filters.heist_filters.filters.heist_wings = {
                min: min ? min : value,
                max: max ? max : value
            };
        }

        const { heistEscapeRoutesRevealed } = item.properties;
        if (heistEscapeRoutesRevealed) {
            const { min, max, value } = heistEscapeRoutesRevealed;
            query.filters.heist_filters.filters.heist_escape_routes = {
                min: min ? min : value,
                max: max ? max : value
            };
        }

        const { heistSecretRewardRoomsRevealed } = item.properties;
        if (heistSecretRewardRoomsRevealed) {
            const { min, max, value } = heistSecretRewardRoomsRevealed;
            query.filters.heist_filters.filters.heist_reward_rooms = {
                min: min ? min : value,
                max: max ? max : value
            };
        }
    }
}
