import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemMod, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionImplicitsParserService implements ItemSectionParserService {
    private readonly phrase = ' (implicit)';

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const implicitSection = item.sections.find(x => x.content.indexOf(this.phrase) !== -1);
        if (!implicitSection) {
            return null;
        }

        target.implicits = implicitSection.lines.map(line => {
            const implicit: ItemMod = {
                text: line.replace(this.phrase, '')
            };
            return implicit;
        });
        return implicitSection;
    }
}


