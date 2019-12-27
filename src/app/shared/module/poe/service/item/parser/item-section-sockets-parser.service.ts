import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionSocketsParserService implements ItemSectionParserService {
    private readonly phrase = 'Sockets: ';

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const socketsSection = item.sections.find(x => x.content.indexOf(this.phrase) === 0);
        if (!socketsSection) {
            return null;
        }        
        target.sockets = socketsSection.lines[0].slice(this.phrase.length);
        return socketsSection;
    }
}
