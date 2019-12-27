import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionRequirementsParserService implements ItemSectionParserService {
    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const requirementsSection = item.sections.find(x => x.content.indexOf('Requirements:') === 0);
        if (!requirementsSection) {
            return null;
        }

        target.requirements = {};

        const lines = requirementsSection.lines;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            ['Level: '].forEach(phrase =>
                target.requirements.level = this.parseSimpleValue(line, phrase, target.requirements.level));
            ['Str: ', 'Strength: '].forEach(phrase =>
                target.requirements.str = this.parseSimpleValue(line, phrase, target.requirements.str));
            ['Dex: ', 'Dexterity: '].forEach(phrase =>
                target.requirements.dex = this.parseSimpleValue(line, phrase, target.requirements.dex));
            ['Int: ', 'Intelligence: '].forEach(phrase =>
                target.requirements.int = this.parseSimpleValue(line, phrase, target.requirements.int));
        }
        return requirementsSection;
    }

    private parseSimpleValue(line: string, phrase: string, value: number): number {
        return line.indexOf(phrase) === 0
            ? +line.slice(phrase.length)
            : value;
    }
}
