import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item, ItemProperties, ItemRarity, ItemValue } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemPropertiesSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Properties, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        if (target.rarity === ItemRarity.DivinationCard) {
            return null;
        }

        const phrases = this.getPhrases();
        const propertiesSection = sections.find(section => phrases
            .some(prop => section.content.includes(prop)));
        if (!propertiesSection) {
            return null;
        }

        const props: ItemProperties = {};

        const lines = propertiesSection.lines;
        for (const line of lines) {
            props.weaponPhysicalDamage = this.parseProperty(line, phrases[0], props.weaponPhysicalDamage);
            props.weaponElementalDamage = this.parseProperties(line, phrases[1], props.weaponElementalDamage);
            props.weaponChaosDamage = this.parseProperty(line, phrases[2], props.weaponChaosDamage);
            props.weaponCriticalStrikeChance = this.parseProperty(line, phrases[3], props.weaponCriticalStrikeChance);
            props.weaponAttacksPerSecond = this.parseProperty(line, phrases[4], props.weaponAttacksPerSecond);
            props.weaponRange = this.parseProperty(line, phrases[5], props.weaponRange);
            props.shieldBlockChance = this.parseProperty(line, phrases[6], props.shieldBlockChance);
            props.armourArmour = this.parseProperty(line, phrases[7], props.armourArmour);
            props.armourEvasionRating = this.parseProperty(line, phrases[8], props.armourEvasionRating);
            props.armourEnergyShield = this.parseProperty(line, phrases[9], props.armourEnergyShield);
            props.stackSize = this.parseProperty(line, phrases[10], props.stackSize);
            props.gemLevel = this.parseProperty(line, phrases[11], props.gemLevel);
            props.gemExperience = this.parseProperty(line, phrases[12], props.gemExperience);
            props.mapTier = this.parseProperty(line, phrases[13], props.mapTier);
            props.mapQuantity = this.parseProperty(line, phrases[14], props.mapQuantity);
            props.mapRarity = this.parseProperty(line, phrases[15], props.mapRarity);
            props.mapPacksize = this.parseProperty(line, phrases[16], props.mapPacksize);
            for (let quality = 0; quality < 8; quality++) {
                const old = props.quality;
                props.quality = this.parseProperty(line, phrases[17 + quality], old);
                if (props.quality !== old) {
                    props.qualityType = quality;
                }
            }
            props.heistAreaLevel = this.parseProperty(line, phrases[25], props.heistAreaLevel);
            props.heistWingsRevealed = this.parseProperty(line, phrases[26], props.heistWingsRevealed);
            props.heistEscapeRoutesRevealed = this.parseProperty(line, phrases[27], props.heistEscapeRoutesRevealed);
            props.heistSecretRewardRoomsRevealed = this.parseProperty(line, phrases[28], props.heistSecretRewardRoomsRevealed);
            props.heistReinforcements = this.parseProperty(line, phrases[29], props.heistReinforcements);
        }

        target.properties = props;
        return propertiesSection;
    }

    private parseProperty(line: string, phrase: string, prop: ItemValue): ItemValue {
        return this.parseProperties(line, phrase, [prop])[0];
    }

    private parseProperties(line: string, phrase: string, props: ItemValue[]): ItemValue[] {
        if (!line.startsWith(phrase)) {
            return props;
        }
        return line.slice(phrase.length)
            .split(',')
            .map(text => {
                const max = this.clientString.translate('ItemDisplaySkillGemMaxLevel').replace('{0}', '');
                text = text.replace(max, '');
                return this.parseItemValue(text);
            });
    }

    private getPhrases(): string[] {
        return [
            `${this.clientString.translate('ItemDisplayWeaponPhysicalDamage')}: `,  // 0
            `${this.clientString.translate('ItemDisplayWeaponElementalDamage')}: `,     // 1
            `${this.clientString.translate('ItemDisplayWeaponChaosDamage')}: `, // 2
            `${this.clientString.translate('ItemDisplayWeaponCriticalStrikeChance')}: `,    // 3
            `${this.clientString.translate('ItemDisplayWeaponAttacksPerSecond')}: `,    // 4
            `${this.clientString.translate('ItemDisplayWeaponRange')}: `,   // 5
            `${this.clientString.translate('ItemDisplayShieldBlockChance')}: `, // 6
            `${this.clientString.translate('ItemDisplayArmourArmour')}: `,  // 7
            `${this.clientString.translate('ItemDisplayArmourEvasionRating')}: `,   // 8
            `${this.clientString.translate('ItemDisplayArmourEnergyShield')}: `,    // 9
            `${this.clientString.translate('ItemDisplayStackSize')}: `, // 10
            `${this.clientString.translate('Level')}: `,    // 11
            `${this.clientString.translate('Experience')}: `,   // 12
            `${this.clientString.translate('ItemDisplayMapTier')}: `,   // 13
            `${this.clientString.translate('ItemDisplayMapQuantityIncrease')}: `,   // 14
            `${this.clientString.translate('ItemDisplayMapRarityIncrease')}: `, // 15
            `${this.clientString.translate('ItemDisplayMapPackSizeIncrease')}: `,   // 16
            `${this.clientString.translate('Quality')}: `,  // 17
            `${this.clientString.translate('Quality1')}: `, // 18
            `${this.clientString.translate('Quality2')}: `, // 19
            `${this.clientString.translate('Quality3')}: `, // 20
            `${this.clientString.translate('Quality4')}: `, // 21
            `${this.clientString.translate('Quality5')}: `, // 22
            `${this.clientString.translate('Quality6')}: `, // 23
            `${this.clientString.translate('Quality7')}: `, // 24
            `${this.clientString.translate('ItemDisplayHeistContractLevel')}: `, // 25
            `${this.clientString.translate('ItemDisplayHeistBlueprintWings')}: `, // 26
            `${this.clientString.translate('ItemDisplayHeistBlueprintEscapeRooms')}: `, // 27
            `${this.clientString.translate('ItemDisplayHeistBlueprintRewardRooms')}: `, // 28
            `${this.clientString.translate('ItemDisplayHeistMaxReinforcements')}: `, // 29

        ];
    }
}
