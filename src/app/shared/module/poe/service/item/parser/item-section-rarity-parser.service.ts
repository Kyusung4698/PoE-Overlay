import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '../../../type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionRarityParserService implements ItemSectionParserService {
    private readonly phrase = 'Rarity: ';

    public optional = false;

    public parse(item: ExportedItem, target: Item): Section {
        const raritySection = item.sections.find(x => x.content.indexOf(this.phrase) === 0);
        if (!raritySection) {
            return null;
        }

        const lines = raritySection.lines;
        switch (lines.length) {
            case 2:
                target.type = lines[1];
                break;
            case 3:
                target.name = lines[1];
                target.type = lines[2];
                break;
            default:
                return null;
        }

        target.rarity = lines[0].slice(this.phrase.length).toLowerCase().split(' ').join('') as ItemRarity;
        target.nameType = (`${target.name || ''} ${target.type || ''}`).trim();
        return raritySection;
    }
}
