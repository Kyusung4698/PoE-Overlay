import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '../../../type';
import { ItemSectionExplicitsParserService } from './item-section-explicits-parser.service';
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
        itemSectionRarityParser: ItemSectionRarityParserService,
        itemSectionRequirementsParserService: ItemSectionRequirementsParserService,
        itemSectionNoteParserService: ItemSectionNoteParserService,
        itemSectionItemLevelParserService: ItemSectionItemLevelParserService,
        itemSectionSocketsParserService: ItemSectionSocketsParserService,
        itemSectionPropertiesParserService: ItemSectionPropertiesParserService,
        itemSectionImplicitsParserService: ItemSectionImplicitsParserService,
        itemSectionExplicitsParserService: ItemSectionExplicitsParserService) {
        this.parsers = [
            itemSectionRarityParser,
            itemSectionRequirementsParserService,
            itemSectionNoteParserService,
            itemSectionItemLevelParserService,
            itemSectionSocketsParserService,
            itemSectionPropertiesParserService,
            itemSectionImplicitsParserService,
            itemSectionExplicitsParserService
        ];
    }

    public parse(stringifiedItem: string): Item {
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

        const target: Item = {};
        for (const parser of this.parsers) {
            const sectionOrSections = parser.parse(exportedItem, target);
            if (!sectionOrSections) {
                if (!parser.optional) {
                    return null;
                } else {
                    continue;
                }
            }
            [].concat(sectionOrSections).forEach(section => {
                exportedItem.sections.splice(exportedItem.sections.indexOf(section), 1);
            });
        }
        return target;
    }
}
