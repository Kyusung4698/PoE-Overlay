import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemLevelSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.ItemLevel, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = `${this.clientString.translate('ItemDisplayStringItemLevel')}: `;

        const itemLevelSection = sections.find(x => x.content.startsWith(phrase));
        if (!itemLevelSection) {
            return null;
        }

        const text = itemLevelSection.lines[0].slice(phrase.length);
        target.level = this.parseItemValue(text);
        return itemLevelSection;
    }
}
