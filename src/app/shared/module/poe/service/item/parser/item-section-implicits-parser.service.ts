import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsDescriptionService } from '../../stats-description/stats-description.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionImplicitsParserService implements ItemSectionParserService {
    private readonly phrase = ' (implicit)';

    constructor(private readonly statsDescriptionService: StatsDescriptionService) { }

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

        const implicitSection = item.sections.find(x => x.content.indexOf(this.phrase) !== -1);
        if (!implicitSection) {
            return null;
        }

        const lines = implicitSection.lines.map(line => line.replace(this.phrase, ''));
        const results = this.statsDescriptionService.searchMultiple(lines);
        if (results.length > 0) {
            target.implicits = [];
            for (let index = 0; index < lines.length; index++) {
                const result = results[index];
                if (result) {
                    target.implicits.push({
                        key: result.key,
                        predicate: result.predicate,
                        values: result.values
                    });
                }
            }
        }
        return implicitSection;
    }
}


