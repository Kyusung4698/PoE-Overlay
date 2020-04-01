import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSection, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionUnidentifiedParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;
    public section = ItemSection.Unidentified;

    public parse(item: ExportedItem, target: Item): Section {
        const phrase = new RegExp(`^${this.clientString.translate('ItemPopupUnidentified')}$`);

        const unidentifiedSection = item.sections.find(x => phrase.test(x.content));
        if (!unidentifiedSection) {
            return null;
        }

        target.unidentified = true;
        return unidentifiedSection;
    }
}
