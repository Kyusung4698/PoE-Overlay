import { Injectable } from '@angular/core';
import * as PoETrade from '@data/poe-trade';
import { Item, ItemRarity, Language } from '../../type';
import { ItemService } from './item.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSearchFormService {

    constructor(private readonly itemNameService: ItemService) { }

    public map(item: Item, form: PoETrade.SearchForm): void {
        this.mapName(item, form);
        this.mapRarity(item, form);
        this.mapSockets(item, form);
        this.mapProperties(item, form);
        this.mapRequirements(item, form);
    }

    private mapName(item: Item, form: PoETrade.SearchForm): void {
        // poetrade only supports english names
        form.name = this.itemNameService.getNameType(item.nameId, item.typeId, Language.English);
    }

    private mapRarity(item: Item, form: PoETrade.SearchForm): void {
        switch (item.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                form.rarity = item.rarity;
                break;
            default:
                break;
        }
    }

    private mapSockets(item: Item, form: PoETrade.SearchForm): void {
        const validSockets = (item.sockets || []).filter(x => !!x);
        if (validSockets.length <= 0) {
            return;
        }

        // ignore color for now. just count and linked count.

        const sockets = validSockets.filter(x => !!x.color);
        if (sockets.length > 0) {
            form.sockets_min = `${sockets.length}`;
        }

        const links = validSockets.filter(x => !!x.linked);
        if (links.length > 0) {
            form.link_min = `${links.length + 1}`;
        }
    }

    private mapProperties(item: Item, form: PoETrade.SearchForm): void {
        const prop = item.properties;
        if (!prop) {
            return;
        }

        // TODO: Add Dps if needed
        // if (item.properties.weaponPhysicalDamage) {
        // }
        // if (item.properties.weaponElementalDamage) {
        // }
        // if (item.properties.weaponChaosDamage) {
        // }

        if (prop.weaponAttacksPerSecond) {
            form.aps_min = prop.weaponAttacksPerSecond.value;
        }
        if (prop.weaponCriticalStrikeChance) {
            form.crit_min = prop.weaponCriticalStrikeChance.value.replace('%', '');
        }
        if (prop.armourArmour) {
            form.armour_min = prop.armourArmour.value;
        }
        if (prop.armourEvasionRating) {
            form.evasion_min = prop.armourEvasionRating.value;
        }
        if (prop.armourEnergyShield) {
            form.shield_min = prop.armourEnergyShield.value;
        }
        if (prop.shieldBlockChance) {
            form.block_min = prop.shieldBlockChance.value;
        }
    }

    private mapRequirements(item: Item, form: PoETrade.SearchForm): void {
        const req = item.requirements;
        if (!req) {
            return;
        }

        if (req.level) {
            form.rlevel_min = `${req.level}`;
        }
        if (req.str) {
            form.rstr_min = `${req.str}`;
        }
        if (req.dex) {
            form.rdex_min = `${req.dex}`;
        }
        if (req.int) {
            form.rint_min = `${req.int}`;
        }
    }
}
