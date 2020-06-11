import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { BaseItemCategoryService, BaseItemTypeService, ItemCategory } from '../../base-item-type';
import { Item, ItemRarity } from '../../item';
import { WordService } from '../../word';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

interface ItemRarityKeyValue {
    key: string;
    value: ItemRarity;
}

const TEXT_REGEX = /<<[^>>]*>>/g;

@Injectable({
    providedIn: 'root'
})
export class ItemRaritySectionParserService extends ItemSectionParserService {
    constructor(
        private readonly clientString: ClientStringService,
        private readonly wordService: WordService,
        private readonly baseItemTypeService: BaseItemTypeService,
        private readonly baseItemCategoryService: BaseItemCategoryService) {
        super(ItemSectionType.Rartiy, false);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = `${this.clientString.translate('ItemDisplayStringRarity')}: `;

        const raritySection = sections.find(x => x.content.startsWith(phrase));
        if (!raritySection) {
            return null;
        }

        const lines = raritySection.lines;

        const rarities = this.getRarities();
        const rarityValue = lines[0].slice(phrase.length).trim();

        const rarity = rarities.find(x => x.key === rarityValue);
        if (!rarity) {
            return null;
        }

        target.rarity = rarity.value;

        switch (lines.length) {
            case 2:
                target.type = lines[1].replace(TEXT_REGEX, '');
                target.typeId = this.baseItemTypeService.search(target.type);
                break;
            case 3:
                target.name = lines[1].replace(TEXT_REGEX, '');
                target.nameId = this.wordService.search(target.name);
                target.type = lines[2].replace(TEXT_REGEX, '');
                target.typeId = this.baseItemTypeService.search(target.type);
                break;
            default:
                return null;
        }

        if (!target.type) {
            return null;
        }

        target.category = this.baseItemCategoryService.get(target.typeId);
        if (!target.category) {
            return null;
        }

        if (target.category.startsWith(ItemCategory.Gem)) {
            for (const section of sections) {
                if (section.lines.length !== 1) {
                    continue;
                }

                if (section.lines[0].length <= target.type.length) {
                    continue;
                }

                const type = section.lines[0];
                const id = this.baseItemTypeService.search(type);
                if (id === undefined || id.indexOf('Vaal') === -1) {
                    continue;
                }

                target.typeId = id;
                target.type = type;
                break;
            }
        }

        return raritySection;
    }

    private getRarities(): ItemRarityKeyValue[] {
        return [
            this.createRarity('ItemDisplayStringNormal', ItemRarity.Normal),
            this.createRarity('ItemDisplayStringMagic', ItemRarity.Magic),
            this.createRarity('ItemDisplayStringRare', ItemRarity.Rare),
            this.createRarity('ItemDisplayStringUnique', ItemRarity.Unique),
            this.createRarity('ItemDisplayStringCurrency', ItemRarity.Currency),
            this.createRarity('ItemDisplayStringGem', ItemRarity.Gem),
            this.createRarity('ItemDisplayStringDivinationCard', ItemRarity.DivinationCard)
        ];
    }

    private createRarity(key: string, value: ItemRarity): ItemRarityKeyValue {
        return { key: this.clientString.translate(key), value };
    }
}
