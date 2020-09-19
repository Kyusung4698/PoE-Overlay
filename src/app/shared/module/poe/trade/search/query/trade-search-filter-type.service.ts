import { Injectable } from '@angular/core';
import { Language, TradeSearchHttpQuery } from '@data/poe/schema';
import { Item, ItemRarity, ItemService } from '../../../item';
import { ItemCategory } from '../../../item/base-item-type';
import { TradeSearchFilterService } from './trade-search-filter.service';

@Injectable({
    providedIn: 'root'
})
export class TradeSearchFilterTypeService implements TradeSearchFilterService {

    constructor(private readonly item: ItemService) { }

    public add(item: Item, language: Language, query: TradeSearchHttpQuery): void {
        query.filters.type_filters = {
            filters: {}
        };

        const name = this.item.getName(item.nameId, language);
        if (name) {
            query.name = name;
        }

        const type = this.item.getType(item.typeId, language);
        if (type) {
            query.type = type;
        }

        switch (item.category) {
            // weapon
            case ItemCategory.Weapon:
            case ItemCategory.WeaponOne:
            case ItemCategory.WeaponOneMelee:
            case ItemCategory.WeaponTwoMelee:
            case ItemCategory.WeaponBow:
            case ItemCategory.WeaponClaw:
            case ItemCategory.WeaponDagger:
            case ItemCategory.WeaponRunedagger:
            case ItemCategory.WeaponOneAxe:
            case ItemCategory.WeaponOneMace:
            case ItemCategory.WeaponOneSword:
            case ItemCategory.WeaponSceptre:
            case ItemCategory.WeaponStaff:
            case ItemCategory.WeaponWarstaff:
            case ItemCategory.WeaponTwoAxe:
            case ItemCategory.WeaponTwoMace:
            case ItemCategory.WeaponTwoSword:
            case ItemCategory.WeaponWand:
            case ItemCategory.WeaponRod:
            // armour
            case ItemCategory.Armour:
            case ItemCategory.ArmourChest:
            case ItemCategory.ArmourBoots:
            case ItemCategory.ArmourGloves:
            case ItemCategory.ArmourHelmet:
            case ItemCategory.ArmourShield:
            case ItemCategory.ArmourQuiver:
            // accessory
            case ItemCategory.Accessory:
            case ItemCategory.AccessoryAmulet:
            case ItemCategory.AccessoryBelt:
            case ItemCategory.AccessoryRing:
            case ItemCategory.AccessoryTrinket:
                if (item.rarity === ItemRarity.Unique) {
                    query.filters.type_filters.filters.rarity = {
                        option: ItemRarity.Unique
                    };
                } else {
                    query.filters.type_filters.filters.rarity = {
                        option: ItemRarity.NonUnique
                    };

                    if (query.name) {
                        query.term = `${query.name || ''} ${query.type || ''}`.trim();
                        query.name = query.type = undefined;
                    }
                }
                query.filters.type_filters.filters.category = {
                    option: item.category,
                };
                break;
            // jewel
            case ItemCategory.Jewel:
            case ItemCategory.JewelAbyss:
            // flasks
            case ItemCategory.Flask:
            // map
            case ItemCategory.Map:
            // monster
            case ItemCategory.MonsterBeast:
                query.filters.type_filters.filters.rarity = {
                    option: item.rarity === ItemRarity.Unique
                        ? ItemRarity.Unique
                        : ItemRarity.NonUnique
                };
                query.filters.type_filters.filters.category = {
                    option: item.category,
                };
                break;
            // gem
            case ItemCategory.Gem:
            case ItemCategory.GemActivegem:
            case ItemCategory.GemSupportGem:
            case ItemCategory.GemSupportGemplus:
            case ItemCategory.Watchstone:
            case ItemCategory.Leaguestone:
            // currency
            case ItemCategory.Currency:
            case ItemCategory.CurrencyPiece:
            case ItemCategory.CurrencyResonator:
            case ItemCategory.CurrencyFossil:
            case ItemCategory.CurrencyIncubator:
            case ItemCategory.CurrencyHeistTarget:
            // heist
            case ItemCategory.HeistEquipment:
            case ItemCategory.HeistEquipmentGear:
            case ItemCategory.HeistEquipmentTool:
            case ItemCategory.HeistEquipmentCloak:
            case ItemCategory.HeistEquipmentBrooch:
            case ItemCategory.HeistEquipmentMission:
            case ItemCategory.HeistEquipmentContract:
            case ItemCategory.HeistEquipmentBlueprint:
            // map
            case ItemCategory.MapFragment:
            case ItemCategory.MapScarab:
            // divination card
            case ItemCategory.Card:
                query.filters.type_filters.filters.category = {
                    option: item.category,
                };
                break;
            // don't work yet
            case ItemCategory.MonsterSample:
            // prophecy
            case ItemCategory.Prophecy:
                query.filters.type_filters.filters.category = {
                    option: item.category,
                };
                query.term = query.type;
                query.type = undefined;
                break;
            default:
                break;
        }
    }

}
