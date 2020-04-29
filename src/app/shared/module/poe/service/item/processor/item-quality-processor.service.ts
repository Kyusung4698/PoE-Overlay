import { Injectable } from '@angular/core';
import { Item, ItemStat, ItemValueProperty } from '@shared/module/poe/type';

const QUALITY_MAX = 20;

@Injectable({
    providedIn: 'root'
})
export class ItemQualityProcessorService {

    public process(item: Item, normalizeQuality: boolean): void {
        const { properties, stats, corrupted } = item;
        if (!properties || !stats || corrupted) {
            return;
        }

        const quality = properties.quality
            ? this.parseValue(properties.quality.value.text)
            : 0;

        const increasedQuality = this.calculateModifier(stats, 'local_item_quality_+');

        const { armourArmour } = properties;
        if (armourArmour) {
            const increasedArmour = this.calculateModifier(stats,
                'local_physical_damage_reduction_rating_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourArmour, quality, increasedQuality, increasedArmour, normalizeQuality);
        }

        const { armourEnergyShield } = properties;
        if (armourEnergyShield) {
            const increasedEnergyShield = this.calculateModifier(stats,
                'local_energy_shield_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourEnergyShield, quality, increasedQuality, increasedEnergyShield, normalizeQuality);
        }

        const { armourEvasionRating } = properties;
        if (armourEvasionRating) {
            const increasedEvasionRating = this.calculateModifier(stats,
                'local_evasion_rating_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateTier(armourEvasionRating, quality, increasedQuality, increasedEvasionRating, normalizeQuality);
        }

        const { weaponPhysicalDamage } = properties;
        if (weaponPhysicalDamage) {
            const increasedPhysicalDamage = this.calculateModifier(stats,
                'local_physical_damage_+% local_weapon_no_physical_damage');
            this.calculateTier(weaponPhysicalDamage, quality, increasedQuality, increasedPhysicalDamage, normalizeQuality)
        }
    }

    private calculateModifier(stats: ItemStat[], ...statIds: string[]): number {
        return stats
            .filter(x => statIds.includes(x.id) && x.values && x.values.length)
            .map(x => +x.values[0].text.replace('%', ''))
            .filter(x => !isNaN(x))
            .reduce((a, b) => a + b, 0);
    }

    private calculateTier(
        property: ItemValueProperty, quality: number,
        increasedQuality: number, modifier: number,
        normalizeQuality: boolean): void {

        const value = this.parseValue(property.value.text);
        const min = value / (1 + ((quality + modifier) / 100));
        const max = min * (1 + ((Math.max(quality, QUALITY_MAX + increasedQuality) + modifier) / 100));

        if (normalizeQuality) {
            const normalized = min * (1 + ((QUALITY_MAX + modifier) / 100));
            property.value.value = Math.round(normalized * 100) / 100;
        }

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
