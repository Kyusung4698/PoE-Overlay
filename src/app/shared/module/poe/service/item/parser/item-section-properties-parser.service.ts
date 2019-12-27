import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemProperty, ItemSectionParserService, Section } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionPropertiesParserService implements ItemSectionParserService {
    // not provided in content.ggpk
    private readonly properties = [
        // jewels
        'Limited to: ',
        'Radius: ',
        // currency
        'Stack Size: ',
        // attack
        'Physical Damage: ',
        'Critical Strike Chance: ',
        'Attacks per Second: ',
        'Weapon Range: ',
        // defense
        'Armour: ',
        'Evasion Rating: ',
        'Energy Shield: ',
        'Block: ',
    ];

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const propertiesSection = item.sections.find(x => this.properties.findIndex(prop => x.content.indexOf(prop) !== -1) !== -1);
        if (!propertiesSection) {
            return null;
        }

        target.properties = propertiesSection.lines.map(line => {

            const augmented = line.indexOf('(augmented)') !== -1;
            let text = line.replace('(augmented)', '');
            let value: string = undefined;

            const prop = this.properties.find(prop => line.indexOf(prop) === 0);
            if (prop) {
                value = text.slice(prop.length);
                text = text.slice(0, prop.length - 1);
            }
            const property: ItemProperty = {
                text: text,
                augmented: augmented,
                value: value
            };
            return property;
        });
        return propertiesSection;
    }
}
