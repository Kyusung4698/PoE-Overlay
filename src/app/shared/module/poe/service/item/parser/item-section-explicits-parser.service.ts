import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsDescriptionService } from '../../stats-description/stats-description.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionExplicitsParserService implements ItemSectionParserService {
    private readonly phrase = ' (crafted)';

    constructor(private readonly statsDescriptionService: StatsDescriptionService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section[] {
        switch (target.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                break;
            default:
                return null;
        }

        const result: Section[] = [];
        for (const section of item.sections) {
            if (this.parseSection(section, target)) {
                result.push(section);
            }
        }
        return result;
    }

    private parseSection(section: Section, target: Item): boolean {
        const lines = section.lines.map(line => line.replace(this.phrase, ''));

        const results = this.statsDescriptionService.searchMultiple(lines);
        if (results.length === 0) {
            return false;
        }

        if (target.explicits) {
            target.explicits.push([]);
        } else {
            target.explicits = [[]];
        }

        for (let index = 0; index < lines.length; index++) {
            const result = results[index];
            if (result) {
                target.explicits[target.explicits.length - 1].push({
                    key: result.key,
                    predicate: result.predicate,
                    values: result.values,
                    crafted: section.lines[index].indexOf(this.phrase) !== -1,
                });
            }
        }

        return true;
    }
}
