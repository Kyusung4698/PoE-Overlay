import { Injectable } from '@angular/core';
import { Item, ItemRarity, ItemSocketsService } from '@shared/module/poe/item';
import { ItemCategory } from '@shared/module/poe/item/base-item-type';
import { EvaluateFeatureSettings } from '../evaluate-feature-settings';

export interface EvaluateQueryItemResult {
    queryItem: Item;
    defaultItem: Item;
}

@Injectable({
    providedIn: 'root'
})
export class EvaluateQueryItemProvider {

    constructor(private readonly sockets: ItemSocketsService) { }

    public provide(item: Item, settings: EvaluateFeatureSettings): EvaluateQueryItemResult {
        const defaultItem: Item = this.copy({
            nameId: item.nameId,
            typeId: item.typeId,
            category: item.category,
            rarity: item.rarity,
            corrupted: item.corrupted,
            unidentified: item.unidentified,
            veiled: item.veiled,
            influences: item.influences || {},
            damage: {},
            stats: [],
            properties: {
                qualityType: (item.properties || {}).qualityType
            },
            requirements: {},
            sockets: new Array((item.sockets || []).length).fill({}),
        });
        const queryItem = this.copy(defaultItem);

        if (settings.evaluateItemSearchPropertyItemLevel) {
            queryItem.level = item.level;
        }

        const count = this.sockets.getLinkCount(item.sockets);
        if (count >= settings.evaluateItemSearchPropertyLinks) {
            queryItem.sockets = item.sockets;
        }

        if (settings.evaluateItemSearchPropertyMiscs) {
            const prop = item.properties;
            if (prop) {
                queryItem.properties.gemLevel = prop.gemLevel;
                queryItem.properties.mapTier = prop.mapTier;
                if (item.rarity === ItemRarity.Gem || prop.qualityType > 0) {
                    queryItem.properties.quality = prop.quality;
                }
            }
        }

        if (settings.evaluateItemSearchPropertyAttack) {
            queryItem.damage = item.damage;

            const prop = item.properties;
            if (prop) {
                if (item.category.startsWith(ItemCategory.Weapon)) {
                    queryItem.properties.weaponAttacksPerSecond = prop.weaponAttacksPerSecond;
                    queryItem.properties.weaponCriticalStrikeChance = prop.weaponCriticalStrikeChance;
                }
            }
        }

        if (settings.evaluateItemSearchPropertyDefense) {
            const prop = item.properties;
            if (prop) {
                if (item.category.startsWith(ItemCategory.Armour)) {
                    queryItem.properties.armourArmour = prop.armourArmour;
                    queryItem.properties.armourEvasionRating = prop.armourEvasionRating;
                    queryItem.properties.armourEnergyShield = prop.armourEnergyShield;
                    queryItem.properties.shieldBlockChance = prop.shieldBlockChance;
                }
            }
        }

        if (!settings.evaluateItemSearchPropertyItemType) {
            if (item.rarity === ItemRarity.Normal ||
                item.rarity === ItemRarity.Magic ||
                item.rarity === ItemRarity.Rare) {
                if (item.category.startsWith(ItemCategory.Weapon) ||
                    item.category.startsWith(ItemCategory.Armour) ||
                    item.category.startsWith(ItemCategory.Accessory)) {
                    queryItem.typeId = queryItem.nameId = undefined;
                }
            }
        }

        if (item.stats) {
            if (item.rarity === ItemRarity.Unique && settings.evaluateItemSearchStatUniqueAll) {
                queryItem.stats = item.stats;
            } else {
                queryItem.stats = item.stats.map(stat => {
                    const key = `${stat.type}.${stat.tradeId}`;
                    return settings.evaluateItemSearchStats[key] ? stat : undefined;
                });
            }
        }

        return {
            defaultItem: this.copy(defaultItem),
            queryItem: this.copy(queryItem)
        };
    }

    private copy(item: Item): Item {
        return JSON.parse(JSON.stringify(item));
    }
}
