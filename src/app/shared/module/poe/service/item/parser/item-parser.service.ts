import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemPostParserService, ItemSectionParserService, Section } from '../../../type';
import { ItemPostParserDamageService } from './item-post-parser-damage.service';
import { ItemPostParserPseudoService } from './item-post-parser-pseudo.service';
import { ItemSectionCorruptedParserService } from './item-section-corrupted-parser.service';
import { ItemSectionInfluencesParserService } from './item-section-influences-parser.service';
import { ItemSectionItemLevelParserService } from './item-section-item-level-parser.service';
import { ItemSectionNoteParserService } from './item-section-note-parser.service';
import { ItemSectionPropertiesParserService } from './item-section-properties-parser.service';
import { ItemSectionRarityParserService } from './item-section-rarity-parser.service';
import { ItemSectionRequirementsParserService } from './item-section-requirements-parser.service';
import { ItemSectionSocketsParserService } from './item-section-sockets-parser.service';
import { ItemSectionStatsParserService } from './item-section-stats-parser.service';
import { ItemSectionUnidentifiedParserService } from './item-section-unidentified-parser.service';
import { ItemSectionVeiledParserService } from './item-section-veiled-parser.service';

@Injectable({
    providedIn: 'root'
})
export class ItemParserService {
    private readonly parsers: ItemSectionParserService[];
    private readonly postParsers: ItemPostParserService[];

    constructor(
        itemSectionRarityParser: ItemSectionRarityParserService,
        itemSectionRequirementsParserService: ItemSectionRequirementsParserService,
        itemSectionNoteParserService: ItemSectionNoteParserService,
        itemSectionItemLevelParserService: ItemSectionItemLevelParserService,
        itemSectionSocketsParserService: ItemSectionSocketsParserService,
        itemSectionPropertiesParserService: ItemSectionPropertiesParserService,
        itemSectionCorruptedParserService: ItemSectionCorruptedParserService,
        itemSectionInfluencesParserService: ItemSectionInfluencesParserService,
        itemSectionVeiledParserService: ItemSectionVeiledParserService,
        itemSectionStatsParserService: ItemSectionStatsParserService,
        itemSectionUnidentifiedParserService: ItemSectionUnidentifiedParserService,
        itemPostParserDamageService: ItemPostParserDamageService,
        itemPostParserPseudoService: ItemPostParserPseudoService) {
        this.parsers = [
            itemSectionRarityParser,
            itemSectionRequirementsParserService,
            itemSectionNoteParserService,
            itemSectionItemLevelParserService,
            itemSectionSocketsParserService,
            itemSectionPropertiesParserService,
            itemSectionCorruptedParserService,
            itemSectionVeiledParserService,
            itemSectionInfluencesParserService,
            itemSectionUnidentifiedParserService,
            itemSectionStatsParserService,
        ];
        this.postParsers = [
            itemPostParserDamageService,
            itemPostParserPseudoService
        ];
    }

    public parse(stringifiedItem: string, sections?: {
        [section: number]: boolean
    }): Item {
        const exportedItem: ExportedItem = {
            sections: stringifiedItem
                .split('--------')
                .map(section => section
                    .split(/\r?\n/)
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
            if (sections && !sections[parser.section]) {
                continue;
            }
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
        for (const postParser of this.postParsers) {
            postParser.process(target);
        }
        return target;
    }
}
