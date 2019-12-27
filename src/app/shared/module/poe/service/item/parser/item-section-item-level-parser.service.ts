import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionItemLevelParserService implements ItemSectionParserService {
    private readonly phrase = 'Item Level: ';

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const itemLevelSection = item.sections.find(x => x.content.indexOf(this.phrase) === 0);
        if (!itemLevelSection) {
            return null;
        }
        target.level = +itemLevelSection.lines[0].slice(this.phrase.length);
        return itemLevelSection;
    }
}
