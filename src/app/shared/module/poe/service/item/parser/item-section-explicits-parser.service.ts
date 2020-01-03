import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsDescriptionService } from '../../stats-description/stats-description.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionExplicitsParserService implements ItemSectionParserService {
    private readonly phrase = ' (crafted)';

    constructor(private readonly statsDescriptionService: StatsDescriptionService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const explicitSection = item.sections.find(x => x.content.indexOf(this.phrase) !== -1);
        if (explicitSection) {
            this.parseSection(explicitSection, target);
            return explicitSection;
        }

        for (const section of item.sections) {
            if (this.parseSection(section, target)) {
                return section;
            }
        }
        return undefined;
    }

    private parseSection(section: Section, target: Item): boolean {
        const lines = section.lines.map(line => line.replace(this.phrase, ''));

        const results = this.statsDescriptionService.searchMultiple(lines);
        if (results.length === 0) {
            return false;
        }

        target.explicits = [];
        for (let index = 0; index < lines.length; index++) {
            const result = results[index];
            if (result) {
                target.explicits.push({
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
