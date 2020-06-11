import { Injectable } from '@angular/core';
import { Item, ItemRarity } from '../../item';
import { StatsSearchFilter, StatsSearchOptions, StatsService } from '../../stat';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemStatsSectionParserService extends ItemSectionParserService {
    constructor(private readonly statsService: StatsService) {
        super(ItemSectionType.Stats, true);
    }

    public parse(sections: ItemSection[], target: Item, filter: StatsSearchFilter): ItemSection {
        // TODO: refactor this
        switch (target.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                {
                    const contents = sections.map(section => section.content);
                    const content = contents.join('\n');

                    const result = this.statsService.search(contents, this.createOptions(target), filter);
                    const sorted = result.sort((a, b) => content.indexOf(a.match.text) - content.indexOf(b.match.text));
                    target.stats = sorted.map(x => {
                        x.stat.values = x.stat.values.map(value => {
                            return this.parseItemValue(value.text);
                        });
                        return x.stat;
                    });
                }
                break;
            default:
                break;
        }
        return null;
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


