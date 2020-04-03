import { Injectable } from '@angular/core';
import { Item, ItemPostParserService, ItemStat, ItemValueProperty } from '@shared/module/poe/type';

const QUALITY_MAX = 20;

@Injectable({
    providedIn: 'root'
})
export class ItemPostParserQualityService implements ItemPostParserService {

    public process(item: Item): void {
        const { properties, stats } = item;
        if (!properties || !stats) {
            return;
        }

        const quality = properties.quality
            ? this.parseValue(properties.quality.value.text)
            : 0;

        const { armourArmour } = properties;
        if (armourArmour) {
            const increasedArmour = this.calculateModifier(stats,
                'local_physical_damage_reduction_rating_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourArmour, quality, increasedArmour);
        }

        const { armourEnergyShield } = properties;
        if (armourEnergyShield) {
            const increasedEnergyShield = this.calculateModifier(stats,
                'local_energy_shield_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourEnergyShield, quality, increasedEnergyShield);
        }

        const { armourEvasionRating } = properties;
        if (armourEvasionRating) {
            const increasedEvasionRating = this.calculateModifier(stats,
                'local_evasion_rating_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourEvasionRating, quality, increasedEvasionRating);
        }

        const { weaponPhysicalDamage } = properties;
        if (weaponPhysicalDamage) {
            const increasedPhysicalDamage = this.calculateModifier(stats,
                'local_physical_damage_+% local_weapon_no_physical_damage');
            this.calculateTier(weaponPhysicalDamage, quality, increasedPhysicalDamage)
        }
    }

    private calculateModifier(stats: ItemStat[], ...statIds: string[]): number {
        return stats
            .filter(x => statIds.includes(x.id) && x.values && x.values.length)
            .map(x => +x.values[0].text.replace('%', ''))
            .filter(x => !isNaN(x))
            .reduce((a, b) => a + b, 0);
    }

    private calculateTier(property: ItemValueProperty, quality: number, modifier: number = 0): void {
        const value = this.parseValue(property.value.text);
        const min = value / (1 + ((quality + modifier) / 100));
        const max = min * (1 + ((Math.max(quality, QUALITY_MAX) + modifier) / 100));
        property.value.tier = {
            min: Math.round(min),
            max: Math.round(max)
        };
    }

    private parseValue(text: string): number {
        return text
            .split('-')
            .map(x => +x.replace('%', ''))
            .reduce((a, b) => a + b, 0);
    }
}
