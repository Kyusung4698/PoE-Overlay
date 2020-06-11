import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item } from '../../../item';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterMiscsService implements TradeSearchFilterService {
    public add(item: Item, _: Language, query: TradeSearchHttpQuery): void {
        query.filters.misc_filters = {
            filters: {}
        };

        const { level } = item;
        if (level) {
            const { min, max } = level;
            query.filters.misc_filters.filters.ilvl = { min, max };
        }

        query.filters.misc_filters.filters.corrupted = {
            option: `${!!item.corrupted}`
        };

        if (item.unidentified) {
            query.filters.misc_filters.filters.identified = {
                option: `${!item.unidentified}`
            };
        }

        query.filters.misc_filters.filters.veiled = {
            option: `${!!item.veiled}`
        };

        this.mapInfluences(item, query);

        if (!item.properties) {
            return;
        }

        const { quality } = item.properties;
        if (quality) {
            const { min, max } = quality;
            query.filters.misc_filters.filters.quality = { min, max };
        }

        const { gemLevel } = item.properties;
        if (gemLevel) {
            const { min, max } = gemLevel;
            query.filters.misc_filters.filters.gem_level = { min, max };
        }

        const { gemExperience } = item.properties;
        if (gemExperience) {
            const splittedExp = gemExperience.text.split('/');
            const exp = +(splittedExp[0] || '').split('.').join('');
            const expMax = +(splittedExp[1] || '').split('.').join('');
            if (!isNaN(exp) && !isNaN(expMax)) {
                const expFactor = (exp / expMax) * 100;
                query.filters.misc_filters.filters.gem_level_progress = {
                    min: Math.round(expFactor * 100) / 100,
                };
            }
        }
    }

    private mapInfluences(item: Item, query: TradeSearchHttpQuery): void {
        if (!item.influences) {
            return;
        }

        if (item.influences.shaper) {
            query.filters.misc_filters.filters.shaper_item = {
                option: `${!!item.influences.shaper}`
            };
        }
        if (item.influences.crusader) {
            query.filters.misc_filters.filters.crusader_item = {
                option: `${!!item.influences.crusader}`
            };
        }
        if (item.influences.hunter) {
            query.filters.misc_filters.filters.hunter_item = {
                option: `${!!item.influences.hunter}`
            };
        }
        if (item.influences.elder) {
            query.filters.misc_filters.filters.elder_item = {
                option: `${!!item.influences.elder}`
            };
        }
        if (item.influences.redeemer) {
            query.filters.misc_filters.filters.redeemer_item = {
                option: `${!!item.influences.redeemer}`
            };
        }
        if (item.influences.warlord) {
            query.filters.misc_filters.filters.warlord_item = {
                option: `${!!item.influences.warlord}`
            };
        }
    }
}
