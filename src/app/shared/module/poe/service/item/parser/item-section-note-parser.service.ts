import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionNoteParserService implements ItemSectionParserService {
    private readonly phrase = 'Note: ';

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const noteSection = item.sections.find(x => x.content.indexOf(this.phrase) === 0);
        if (!noteSection) {
            return null;
        }

        target.note = noteSection.lines[0].slice(this.phrase.length);
        return noteSection;
    }
}


