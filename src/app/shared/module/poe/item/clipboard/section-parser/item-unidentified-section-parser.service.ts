import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemUnidentifiedSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Unidentified, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = new RegExp(`^${this.clientString.translate('ItemPopupUnidentified')}$`);

        const unidentifiedSection = sections.find(x => phrase.test(x.content));
        if (!unidentifiedSection) {
            return null;
        }

        target.unidentified = true;
        return unidentifiedSection;
    }
}
