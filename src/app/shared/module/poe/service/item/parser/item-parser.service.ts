import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Language, Section } from '../../../type';
import { ContextService } from '../../context.service';
import { ItemSectionDescriptonParserService } from './item-section-descripton-parser.service';
import { ItemSectionImplicitsParserService } from './item-section-implicits-parser.service';
import { ItemSectionItemLevelParserService } from './item-section-item-level-parser.service';
import { ItemSectionNoteParserService } from './item-section-note-parser.service';
import { ItemSectionPropertiesParserService } from './item-section-properties-parser.service';
import { ItemSectionRarityParserService } from './item-section-rarity-parser.service';
import { ItemSectionRequirementsParserService } from './item-section-requirements-parser.service';
import { ItemSectionSocketsParserService } from './item-section-sockets-parser.service';

@Injectable({
    providedIn: 'root'
})
export class ItemParserService {
    private readonly parsers: ItemSectionParserService[];

    constructor(
        private readonly context: ContextService,
        itemSectionRarityParser: ItemSectionRarityParserService,
        itemSectionRequirementsParserService: ItemSectionRequirementsParserService,
        itemSectionNoteParserService: ItemSectionNoteParserService,
        itemSectionItemLevelParserService: ItemSectionItemLevelParserService,
        itemSectionSocketsParserService: ItemSectionSocketsParserService,
        itemSectionImplicitsParserService: ItemSectionImplicitsParserService,
        itemSectionPropertiesParserService: ItemSectionPropertiesParserService,
        itemSectionDescriptonParserService: ItemSectionDescriptonParserService) {
        this.parsers = [
            itemSectionRarityParser,
            itemSectionRequirementsParserService,
            itemSectionNoteParserService,
            itemSectionItemLevelParserService,
            itemSectionSocketsParserService,
            itemSectionImplicitsParserService,
            itemSectionPropertiesParserService,
            // itemSectionDescriptonParserService, TODO: Disable for now
        ];
    }

    public parse(stringifiedItem: string, language?: Language): Item {
        language = language || this.context.get().language;

        const exportedItem: ExportedItem = {
            sections: stringifiedItem
                .split('--------')
                .map(section => section
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line.length > 0))
                .filter(lines => lines.length > 0)
                .map(lines => {
                    const section: Section = {
                        lines,
                        content: lines.join('\n'),
                    };
                    return section;
                })
        };

        const target: Item = { language };
        for (const parser of this.parsers) {
            const section = parser.parse(exportedItem, target);
            if (!section) {
                if (!parser.optional) {
                    return null;
                } else {
                    continue;
                }
            }
            exportedItem.sections.splice(exportedItem.sections.indexOf(section), 1);
        }
        return target;
    }
}
