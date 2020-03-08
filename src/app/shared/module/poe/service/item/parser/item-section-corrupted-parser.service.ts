import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSection, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionCorruptedParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;
    public section = ItemSection.Corrupted;

    public parse(item: ExportedItem, target: Item): Section {
        const phrase = new RegExp(`^${this.clientString.translate('ItemPopupCorrupted')}$`);

        const corruptedSection = item.sections.find(x => phrase.test(x.content));
        if (!corruptedSection) {
            return null;
        }

        target.corrupted = true;
        return corruptedSection;
    }
}
