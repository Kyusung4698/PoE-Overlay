import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionDescriptonParserService implements ItemSectionParserService {
    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const reversedSection = item.sections.reverse();
        const descriptionSection = reversedSection.find(x =>
            x.content.indexOf(':') === -1
            && x.content.indexOf('+') === -1
            && x.content.indexOf('%') === -1);
        if (!descriptionSection) {
            return null;
        }

        target.description = descriptionSection.content.split('\n').join('<br>').split('.').join('.<br>');
        return descriptionSection;
    }
}
