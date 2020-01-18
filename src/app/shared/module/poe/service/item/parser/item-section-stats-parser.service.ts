import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsSearchOptions, StatsService } from '../../stats/stats.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionStatsParserService implements ItemSectionParserService {
    constructor(private readonly statsService: StatsService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        switch (target.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                break;
            default:
                return null;
        }

        const contents = item.sections.map(section => section.content);
        const content = contents.join('\n');

        const result = this.statsService.searchMultiple(contents, this.createOptions(target));
        const sorted = result.sort((a, b) => content.indexOf(a.match.text) - content.indexOf(b.match.text));
        target.stats = sorted.map(x => x.stat);
    }

    private createOptions(item: Item): StatsSearchOptions {
        const options: StatsSearchOptions = {};
        if (!item.properties) {
            return options;
        }

        if (item.properties.weaponPhysicalDamage) {
            options['minimum_added_physical_damage maximum_added_physical_damage'] = true;
        }
        if (item.properties.weaponElementalDamage) {
            options['minimum_added_fire_damage maximum_added_fire_damage'] = true;
            options['minimum_added_cold_damage maximum_added_cold_damage'] = true;
            options['minimum_added_lightning_damage maximum_added_lightning_damage'] = true;
        }
        if (item.properties.weaponChaosDamage) {
            options['minimum_added_chaos_damage maximum_added_chaos_damage'] = true;
        }

        if (item.properties.weaponAttacksPerSecond) {
            options['attack_speed_+%'] = true;
        }

        if (item.properties.armourEvasionRating) {
            options.base_evasion_rating = true;
            options['evasion_rating_+%'] = true;

            if (item.properties.armourEnergyShield) {
                options['evasion_and_energy_shield_+%'] = true;
            }
        }

        if (item.properties.armourArmour) {
            options.base_physical_damage_reduction_rating = true;
            options['physical_damage_reduction_rating_+%'] = true;

            if (item.properties.armourEvasionRating) {
                options['armour_and_evasion_+%'] = true;
            }
            if (item.properties.armourEvasionRating && item.properties.armourEnergyShield) {
                options['armour_and_evasion_and_energy_shield_+%'] = true;
            }
            if (item.properties.armourEnergyShield) {
                options['armour_and_energy_shield_+%'] = true;
            }
        }

        if (item.properties.armourEnergyShield) {
            options.energy_shield = true;
            options['energy_shield_+%'] = true;
        }

        if (item.properties.weaponAttacksPerSecond
            || item.properties.weaponChaosDamage
            || item.properties.weaponCriticalStrikeChance
            || item.properties.weaponElementalDamage
            || item.properties.weaponPhysicalDamage
            || item.properties.weaponRange) {
            options.accuracy_rating = true;
            options['poison_on_hit_%'] = true;
        }

        return options;
    }
}


