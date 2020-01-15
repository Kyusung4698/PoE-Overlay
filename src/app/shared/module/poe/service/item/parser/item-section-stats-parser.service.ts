import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsSearchText, StatsService } from '../../stats/stats.service';

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

        const stats = item.sections.reduce((a, b, index) => a.concat(b.lines.map(line => {
            const text: StatsSearchText = {
                value: line,
                section: index
            };
            return text;
        })), [] as StatsSearchText[]);
        if (stats.length === 0) {
            return null;
        }

        const result = this.statsService.searchMultiple(stats);
        const sorted = result.sort((a, b) => stats.indexOf(a.text) - stats.indexOf(b.text));
        target.stats = sorted.map(x => x.stat);
    }
}


