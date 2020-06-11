import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item, ItemRequirements } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemRequirementsSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Requirements, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = `${this.clientString.translate('ItemPopupRequirements')}:`;

        const requirementsSection = sections.find(x => x.content.startsWith(phrase));
        if (!requirementsSection) {
            return null;
        }

        const levelPhrases = [
            `${this.clientString.translate('Level')}: `
        ];
        const strengthPhrases = [
            `${this.clientString.translate('Strength')}: `,
            `${this.clientString.translate('StrengthShort')}: `
        ];
        const dexterityPhrases = [
            `${this.clientString.translate('Dexterity')}: `,
            `${this.clientString.translate('DexterityShort')}: `
        ];
        const intelligencePhrases = [
            `${this.clientString.translate('Intelligence')}: `,
            `${this.clientString.translate('IntelligenceShort')}: `
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
        return line.startsWith(phrase)
            ? +line.slice(phrase.length)
            : value;
    }
}
