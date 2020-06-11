import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item, ItemInfluences } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemInfluencesSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Influences, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrases = this.getPhrases();

        const influencesSection = sections.find(section =>
            phrases.some(prop => section.content.startsWith(prop)));
        if (!influencesSection) {
            return null;
        }

        const inf: ItemInfluences = {};

        const lines = influencesSection.lines;
        for (const line of lines) {
            inf.crusader = this.parseInfluence(line, phrases[0], inf.crusader);
            inf.redeemer = this.parseInfluence(line, phrases[1], inf.redeemer);
            inf.hunter = this.parseInfluence(line, phrases[2], inf.hunter);
            inf.warlord = this.parseInfluence(line, phrases[3], inf.warlord);
            inf.shaper = this.parseInfluence(line, phrases[4], inf.shaper);
            inf.elder = this.parseInfluence(line, phrases[5], inf.elder);
        }

        target.influences = inf;
        return influencesSection;
    }

    private parseInfluence(line: string, phrase: string, value: boolean): boolean {
        if (!line.startsWith(phrase)) {
            return value;
        }
        return true;
    }

    private getPhrases(): string[] {
        return [
            this.clientString.translate('ItemPopupCrusaderItem'),
            this.clientString.translate('ItemPopupRedeemerItem'),
            this.clientString.translate('ItemPopupHunterItem'),
            this.clientString.translate('ItemPopupWarlordItem'),
            this.clientString.translate('ItemPopupShaperItem'),
            this.clientString.translate('ItemPopupElderItem'),
        ];
    }
}
