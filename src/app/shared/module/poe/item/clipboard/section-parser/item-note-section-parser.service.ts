import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemNoteSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Note, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = `${this.clientString.translate('ItemDisplayStringNote')}: `;

        const noteSection = sections.find(x => x.content.startsWith(phrase));
        if (!noteSection) {
            return null;
        }

        target.note = noteSection.lines[0].slice(phrase.length);
        return noteSection;
    }
}
