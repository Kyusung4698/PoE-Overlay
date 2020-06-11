import { Injectable } from '@angular/core';
import { Item, ItemStat, ItemValue } from '../item';

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

        const quality = properties.quality?.value ?? 0;
        const increasedQuality = this.calculateModifier(stats, 'local_item_quality_+');

        const { armourArmour } = properties;
        if (armourArmour) {
            const increasedArmour = this.calculateModifier(stats,
                'local_physical_damage_reduction_rating_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateQualityTier(armourArmour, quality, increasedQuality, increasedArmour, normalizeQuality);
        }

        const { armourEnergyShield } = properties;
        if (armourEnergyShield) {
            const increasedEnergyShield = this.calculateModifier(stats,
                'local_energy_shield_+%',
                'local_armour_and_energy_shield_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateQualityTier(armourEnergyShield, quality, increasedQuality, increasedEnergyShield, normalizeQuality);
        }

        const { armourEvasionRating } = properties;
        if (armourEvasionRating) {
            const increasedEvasionRating = this.calculateModifier(stats,
                'local_evasion_rating_+%',
                'local_armour_and_evasion_+%',
                'local_armour_and_evasion_and_energy_shield_+%');
            this.calculateQualityTier(armourEvasionRating, quality, increasedQuality, increasedEvasionRating, normalizeQuality);
        }

        const { weaponPhysicalDamage } = properties;
        if (weaponPhysicalDamage) {
            const increasedPhysicalDamage = this.calculateModifier(stats,
                'local_physical_damage_+% local_weapon_no_physical_damage');
            this.calculateQualityTier(weaponPhysicalDamage, quality, increasedQuality, increasedPhysicalDamage, normalizeQuality);
        }
    }

    private calculateQualityTier(
        property: ItemValue, quality: number,
        increasedQuality: number, modifier: number,
        normalizeQuality: boolean): void {

        const { value } = property;
        const base = value / (1 + ((quality + modifier) / 100));
        const min = base * (1 + (modifier / 100));
        const max = base * (1 + ((Math.max(quality, QUALITY_MAX + increasedQuality) + modifier) / 100));

        if (normalizeQuality) {
            const normalized = base * (1 + ((QUALITY_MAX + modifier) / 100));
            property.value = normalized;
        }

        property.tier = { min, max };
    }

    private calculateModifier(stats: ItemStat[], ...statIds: string[]): number {
        return stats
            .filter(x => statIds.includes(x.id) && x.values && x.values.length)
            .reduce((a, b) => a + b.values[0].value, 0);
    }
}
