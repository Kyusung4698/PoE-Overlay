import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemCategory, ItemSearchFiltersService } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFiltersTypeService implements ItemSearchFiltersService {
    public add(item: Item, query: Query): void {
        query.filters.type_filters = {
            filters: {}
        };

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
            // jewel
            case ItemCategory.Jewel:
            case ItemCategory.JewelAbyss:
            // flasks
            case ItemCategory.Flask:
            // map
            case ItemCategory.Map:
                query.filters.type_filters.filters.rarity = {
                    option: item.rarity
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
            case ItemCategory.Prophecy:
            // divination card
            case ItemCategory.Card:
            case ItemCategory.MonsterBeast:
            case ItemCategory.MonsterSample:
            // currency
            case ItemCategory.Currency:
            case ItemCategory.CurrencyPiece:
            case ItemCategory.CurrencyResonator:
            case ItemCategory.CurrencyFossil:
            case ItemCategory.CurrencyIncubator:
            // map
            case ItemCategory.MapFragment:
            case ItemCategory.MapScarab:
                query.filters.type_filters.filters.category = {
                    option: item.category,
                };
                break;
            default:
                break;
        }
    }

}
