import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section, ItemRequirements } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionRequirementsParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const phrase = `${this.clientString.get('ItemPopupRequirements', target.language)}:`;

        const requirementsSection = item.sections.find(x => x.content.indexOf(phrase) === 0);
        if (!requirementsSection) {
            return null;
        }

        const levelPhrases = [
            `${this.clientString.get('Level', target.language)}: `
        ];
        const strengthPhrases = [
            `${this.clientString.get('Strength', target.language)}: `,
            `${this.clientString.get('StrengthShort', target.language)}: `
        ];
        const dexterityPhrases = [
            `${this.clientString.get('Dexterity', target.language)}: `,
            `${this.clientString.get('DexterityShort', target.language)}: `
        ];
        const intelligencePhrases = [
            `${this.clientString.get('Intelligence', target.language)}: `,
            `${this.clientString.get('IntelligenceShort', target.language)}: `
        ];

        const req: ItemRequirements = {};

        const lines = requirementsSection.lines;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            levelPhrases.forEach(x => req.level = this.parseSimpleValue(line, x, req.level));
            strengthPhrases.forEach(x => req.str = this.parseSimpleValue(line, x, req.str));
            dexterityPhrases.forEach(x => req.dex = this.parseSimpleValue(line, x, req.dex));
            intelligencePhrases.forEach(x => req.int = this.parseSimpleValue(line, x, req.int));
        }

        target.requirements = req;
        return requirementsSection;
    }

    private parseSimpleValue(line: string, phrase: string, value: number): number {
        return line.indexOf(phrase) === 0
            ? +line.slice(phrase.length)
            : value;
    }
}
