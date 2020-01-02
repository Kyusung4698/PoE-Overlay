import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '../../../type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionRarityParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = false;

    public parse(item: ExportedItem, target: Item): Section {
        const phrase = `${this.clientString.translate('ItemDisplayStringRarity', target.language)}: `;

        const raritySection = item.sections.find(x => x.content.indexOf(phrase) === 0);
        if (!raritySection) {
            return null;
        }

        const lines = raritySection.lines;

        const rarities = this.getRarities(target);
        const rarityValue = lines[0].slice(phrase.length).trim();

        const rarity = rarities.find(x => x.key === rarityValue);
        if (!rarity) {
            return null;
        }

        target.rarity = rarity.value;

        switch (lines.length) {
            case 2:
                target.type = lines[1];
                break;
            case 3:
                target.name = lines[1];
                target.type = lines[2];
                break;
            default:
                return null;
        }

        target.nameType = (`${target.name || ''} ${target.type || ''}`).trim();
        return raritySection;
    }

    private getRarities(target: Item): {
        key: string,
        value: ItemRarity
    }[] {
        return [
            {
                key: this.clientString.translate('ItemDisplayStringNormal', target.language),
                value: ItemRarity.Normal,
            },
            {
                key: this.clientString.translate('ItemDisplayStringMagic', target.language),
                value: ItemRarity.Magic,
            },
            {
                key: this.clientString.translate('ItemDisplayStringRare', target.language),
                value: ItemRarity.Rare,
            },
            {
                key: this.clientString.translate('ItemDisplayStringUnique', target.language),
                value: ItemRarity.Unique,
            },
            {
                key: this.clientString.translate('ItemDisplayStringCurrency', target.language),
                value: ItemRarity.Currency,
            },
            {
                key: this.clientString.translate('ItemDisplayStringGem', target.language),
                value: ItemRarity.Gem,
            },
            {
                key: this.clientString.translate('ItemDisplayStringDivinationCard', target.language),
                value: ItemRarity.DivinationCard,
            },
        ];
    }
}
