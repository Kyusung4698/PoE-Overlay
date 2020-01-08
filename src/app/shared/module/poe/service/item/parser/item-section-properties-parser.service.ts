import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemProperties, ItemProperty, ItemSectionParserService, Language, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionPropertiesParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;

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
            props.weaponElementalDamage = this.parseProperty(line, phrases[1], props.weaponElementalDamage);
            props.weaponChaosDamage = this.parseProperty(line, phrases[2], props.weaponChaosDamage);
            props.weaponCriticalStrikeChance = this.parseProperty(line, phrases[3], props.weaponCriticalStrikeChance);
            props.weaponAttacksPerSecond = this.parseProperty(line, phrases[4], props.weaponAttacksPerSecond);
            props.weaponRange = this.parseProperty(line, phrases[5], props.weaponRange);
            props.shieldBlockChance = this.parseProperty(line, phrases[6], props.shieldBlockChance);
            props.armourArmour = this.parseProperty(line, phrases[7], props.armourArmour);
            props.armourEvasionRating = this.parseProperty(line, phrases[8], props.armourEvasionRating);
            props.armourEnergyShield = this.parseProperty(line, phrases[9], props.armourEnergyShield);
            props.gemLevel = this.parseProperty(line, phrases[10], props.gemLevel);
            props.quality = this.parseProperty(line, phrases[11], props.quality);
            props.gemExperience = this.parseProperty(line, phrases[12], props.gemExperience);
        }

        target.properties = props;
        return propertiesSection;
    }

    private parseProperty(line: string, phrase: string, prop: ItemProperty): ItemProperty {
        if (line.indexOf(phrase) !== 0) {
            return prop;
        }

        const augmented = line.indexOf(' (augmented)') !== -1;
        const text = line.replace(' (augmented)', '');

        const value = text.slice(phrase.length);

        const property: ItemProperty = {
            augmented,
            value
        };
        return property;
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
            `${this.clientString.translate('Quality')}: `,
            `${this.clientString.translate('Experience')}: `,
        ];
    }
}
