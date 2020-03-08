import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemRarity, ItemSection, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { StatsSearchOptions, StatsService } from '../../stats/stats.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionStatsParserService implements ItemSectionParserService {
    constructor(private readonly statsService: StatsService) { }

    public optional = true;
    public section = ItemSection.Stats;

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
            options.local_minimum_added_physical_damagelocal_maximum_added_physical_damage = true;
        }
        if (item.properties.weaponElementalDamage) {
            options.local_minimum_added_fire_damagelocal_maximum_added_fire_damage = true;
            options.local_minimum_added_cold_damagelocal_maximum_added_cold_damage = true;
            options.local_minimum_added_lightning_damagelocal_maximum_added_lightning_damage = true;
        }
        if (item.properties.weaponChaosDamage) {
            options.local_minimum_added_chaos_damagelocal_maximum_added_chaos_damage = true;
        }

        if (item.properties.weaponAttacksPerSecond) {
            options.local_attack_speed___ = true;
        }

        if (item.properties.armourEvasionRating) {
            options.base_evasion_rating = true;
            options.local_evasion_rating___ = true;
        }

        if (item.properties.armourArmour) {
            options.base_physical_damage_reduction_rating = true;
            options.local_physical_damage_reduction_rating___ = true;
        }

        if (item.properties.armourEnergyShield) {
            options.base_maximum_energy_shield = true;
        }

        if (item.properties.weaponAttacksPerSecond
            || item.properties.weaponChaosDamage
            || item.properties.weaponCriticalStrikeChance
            || item.properties.weaponElementalDamage
            || item.properties.weaponPhysicalDamage
            || item.properties.weaponRange) {
            options.local_accuracy_rating = true;
            options.base_chance_to_poison_on_hit__ = true;
        }

        return options;
    }
}


