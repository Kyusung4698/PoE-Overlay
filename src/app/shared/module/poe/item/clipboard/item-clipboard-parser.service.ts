import { Injectable } from '@angular/core';
import { Item } from '../item';
import { StatsSearchFilter } from '../stat';
import { ItemCorruptedSectionParserService } from './section-parser/item-corrupted-section-parser.service';
import { ItemInfluencesSectionParserService } from './section-parser/item-influences-section-parser.service';
import { ItemLevelSectionParserService } from './section-parser/item-level-section-parser.service';
import { ItemNoteSectionParserService } from './section-parser/item-note-section-parser.service';
import { ItemPropertiesSectionParserService } from './section-parser/item-properties-section-parser.service';
import { ItemRaritySectionParserService } from './section-parser/item-rarity-section-parser.service';
import { ItemRequirementsSectionParserService } from './section-parser/item-requirements-section-parser.service';
import { ItemSection } from './section-parser/item-section';
import { ItemSectionParserService } from './section-parser/item-section-parser.service';
import { ItemSocketsSectionParserService } from './section-parser/item-sockets-section-parser.service';
import { ItemStatsSectionParserService } from './section-parser/item-stats-section-parser.service';
import { ItemUnidentifiedSectionParserService } from './section-parser/item-unidentified-section-parser.service';
import { ItemVeiledSectionParserService } from './section-parser/item-veiled-section-parser.service';

@Injectable({
    providedIn: 'root'
})
export class ItemClipboardParserService {
    private readonly parsers: ItemSectionParserService[];

    constructor(
        itemRaritySectionParserService: ItemRaritySectionParserService,
        itemRequirementsSectionParserService: ItemRequirementsSectionParserService,
        itemNoteSectionParserService: ItemNoteSectionParserService,
        itemLevelSectionParserService: ItemLevelSectionParserService,
        itemSocketsSectionParserService: ItemSocketsSectionParserService,
        itemPropertiesSectionParserService: ItemPropertiesSectionParserService,
        itemCorruptedSectionParserService: ItemCorruptedSectionParserService,
        itemVeiledSectionParserService: ItemVeiledSectionParserService,
        itemInfluencesSectionParserService: ItemInfluencesSectionParserService,
        itemUnidentifiedSectionParserService: ItemUnidentifiedSectionParserService,
        itemStatsSectionParserService: ItemStatsSectionParserService,
    ) {
        this.parsers = [
            itemRaritySectionParserService,
            itemRequirementsSectionParserService,
            itemNoteSectionParserService,
            itemLevelSectionParserService,
            itemSocketsSectionParserService,
            itemPropertiesSectionParserService,
            itemCorruptedSectionParserService,
            itemVeiledSectionParserService,
            itemInfluencesSectionParserService,
            itemUnidentifiedSectionParserService,
            itemStatsSectionParserService
        ];
    }

    // TODO: get the language via rarity
    public parse(
        content: string,
        parse?: {
            [section: number]: boolean
        },
        filter?: StatsSearchFilter): Item {
        let sections = content
            .split('--------')
            .map(section => section
                .split(/\r?\n/)
                .filter(line => line.length > 0))
            .filter(lines => lines.length > 0)
            .map(lines => {
                const section: ItemSection = {
                    lines,
                    content: lines.join('\n'),
                };
                return section;
            });

        const target: Item = { content };

        for (const parser of this.parsers) {
            if (parse && !parse[parser.type]) {
                continue;
            }

            const sectionOrSections = parser.parse(sections, target, filter);
            if (!sectionOrSections) {
                if (!parser.optional) {
                    return null;
                } else {
                    continue;
                }
            }

            const removed = [].concat(sectionOrSections);
            sections = sections.filter(section => !removed.includes(section));
        }
        return target;
    }
}
