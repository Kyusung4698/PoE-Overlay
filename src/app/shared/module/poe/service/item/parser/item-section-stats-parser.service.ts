import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsService } from '../../stats/stats.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionStatsParserService implements ItemSectionParserService {
    constructor(private readonly statsService: StatsService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        switch (target.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                break;
            default:
                return null;
        }

        const stats = item.sections.reduce((a, b) => a.concat(b.lines), []);
        if (stats.length === 0) {
            return null;
        }

        const result = this.statsService.searchMultiple(stats);
        const keys = Object.getOwnPropertyNames(result);
        target.stats = keys.sort((a, b) => stats.indexOf(a) - stats.indexOf(b)).map(key => result[key]);
    }
}


