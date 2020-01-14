import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemInfluences, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionInfluencesParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const phrases = this.getPhrases();

        const influencesSection = item.sections.find(section => phrases
            .findIndex(prop => section.content.indexOf(prop) === 0) !== -1);
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
        if (line.indexOf(phrase) !== 0) {
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
