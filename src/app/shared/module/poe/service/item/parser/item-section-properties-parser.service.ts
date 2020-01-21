import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemProperties, ItemProperty, ItemSection, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionPropertiesParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;
    public section = ItemSection.Properties;

    public parse(item: ExportedItem, target: Item): Section {
        const phrases = this.getPhrases();

        const propertiesSection = item.sections.find(section => phrases
            .findIndex(prop => section.content.indexOf(prop) !== -1) !== -1);
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
            props.gemLevel = this.parseProperty(line, phrases[10], props.gemLevel);
            props.gemExperience = this.parseProperty(line, phrases[11], props.gemExperience);
            props.mapTier = this.parseProperty(line, phrases[12], props.mapTier);
            props.mapQuantity = this.parseProperty(line, phrases[13], props.mapQuantity);
            props.mapRarity = this.parseProperty(line, phrases[14], props.mapRarity);
            props.mapPacksize = this.parseProperty(line, phrases[15], props.mapPacksize);
            for (let quality = 0; quality < 8; quality++) {
                const old = props.quality;
                props.quality = this.parseProperty(line, phrases[16 + quality], old);
                if (props.quality !== old) {
                    props.qualityType = quality;
                }
            }
        }

        target.properties = props;
        return propertiesSection;
    }

    private parseProperty(line: string, phrase: string, prop: ItemProperty): ItemProperty {
        return this.parseProperties(line, phrase, [prop])[0];
    }

    private parseProperties(line: string, phrase: string, props: ItemProperty[]): ItemProperty[] {
        if (line.indexOf(phrase) !== 0) {
            return props;
        }
        return line.slice(phrase.length)
            .split(',')
            .map(text => {
                const max = this.clientString.translate('ItemDisplaySkillGemMaxLevel').replace('%1%', '');
                text = text.replace(max, '');
                const property: ItemProperty = {
                    augmented: text.indexOf(' (augmented)') !== -1,
                    value: text.replace(' (augmented)', '')
                };
                return property;
            });
    }

    private getPhrases(): string[] {
        return [
            `${this.clientString.translate('ItemDisplayWeaponPhysicalDamage')}: `,
            `${this.clientString.translate('ItemDisplayWeaponElementalDamage')}: `,
            `${this.clientString.translate('ItemDisplayWeaponChaosDamage')}: `,
            `${this.clientString.translate('ItemDisplayWeaponCriticalStrikeChance')}: `,
            `${this.clientString.translate('ItemDisplayWeaponAttacksPerSecond')}: `,
            `${this.clientString.translate('ItemDisplayWeaponRange')}: `,
            `${this.clientString.translate('ItemDisplayShieldBlockChance')}: `,
            `${this.clientString.translate('ItemDisplayArmourArmour')}: `,
            `${this.clientString.translate('ItemDisplayArmourEvasionRating')}: `,
            `${this.clientString.translate('ItemDisplayArmourEnergyShield')}: `,
            `${this.clientString.translate('Level')}: `,
            `${this.clientString.translate('Experience')}: `,
            `${this.clientString.translate('ItemDisplayMapTier')}: `,
            `${this.clientString.translate('ItemDisplayMapQuantityIncrease')}: `,
            `${this.clientString.translate('ItemDisplayMapRarityIncrease')}: `,
            `${this.clientString.translate('ItemDisplayMapPackSizeIncrease')}: `,
            `${this.clientString.translate('Quality')}: `,
            `${this.clientString.translate('Quality1')}: `,
            `${this.clientString.translate('Quality2')}: `,
            `${this.clientString.translate('Quality3')}: `,
            `${this.clientString.translate('Quality4')}: `,
            `${this.clientString.translate('Quality5')}: `,
            `${this.clientString.translate('Quality6')}: `,
            `${this.clientString.translate('Quality7')}: `,
        ];
    }
}
