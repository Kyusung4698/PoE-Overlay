import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { environment } from '@env/environment';
import { ContextService } from '../context';
import { Item, ItemRarity, ItemService } from '../item';
import { ItemCategory } from '../item/base-item-type';

const CATEGORY_CN_MAP = {
    [ItemCategory.ArmourBoots]: 'Boots',
    [ItemCategory.ArmourChest]: 'Body Armour',
    [ItemCategory.ArmourGloves]: 'Gloves',
    [ItemCategory.ArmourHelmet]: 'Helmet',
    [ItemCategory.ArmourQuiver]: 'Quiver',
    [ItemCategory.ArmourShield]: 'Shield',
    [ItemCategory.AccessoryAmulet]: 'Amulet',
    [ItemCategory.AccessoryBelt]: 'Belt',
    [ItemCategory.AccessoryRing]: 'Ring',
    [ItemCategory.WeaponBow]: 'Bow',
    [ItemCategory.WeaponClaw]: 'Claw',
    [ItemCategory.WeaponDagger]: 'Dagger',
    [ItemCategory.WeaponRunedagger]: 'Rune Dagger',
    [ItemCategory.WeaponOneAxe]: 'One Hand Axe',
    [ItemCategory.WeaponOneMace]: 'One Hand Mace',
    [ItemCategory.WeaponOneSword]: 'One Hand Sword',
    [ItemCategory.WeaponSceptre]: 'Sceptre',
    [ItemCategory.WeaponStaff]: 'Staff',
    [ItemCategory.WeaponWarstaff]: 'Warstaff',
    [ItemCategory.WeaponTwoAxe]: 'Two Hand Axe',
    [ItemCategory.WeaponTwoMace]: 'Two Hand Mace',
    [ItemCategory.WeaponTwoSword]: 'Two Hand Sword',
    [ItemCategory.WeaponWand]: 'Wand',
    [ItemCategory.WeaponRod]: 'FishingRod',
};

const LANGUAGE_MAPPING = {
    [Language.English]: 'us',
    [Language.French]: 'fr',
    [Language.German]: 'de',
    [Language.Korean]: 'kr',
    [Language.Portuguese]: 'pt',
    [Language.Russian]: 'ru',
    [Language.Spanish]: 'sp',
    [Language.Thai]: 'th',
    // [Language.SimplifiedChinese]: 'cn',
    [Language.TraditionalChinese]: 'tw',
};


@Injectable({
    providedIn: 'root'
})
export class DBItemService {

    constructor(
        private readonly itemService: ItemService,
        private readonly context: ContextService) { }

    public getUrl(item: Item, language?: Language): string {
        language = language || this.context.get().language;

        const { typeId, nameId, rarity, category } = item;

        const cn = CATEGORY_CN_MAP[category];
        const url = environment.poedb.baseUrl.replace('{country}', LANGUAGE_MAPPING[language]);
        if (rarity === ItemRarity.Rare && !!cn) {
            let an = '';

            const base = category.split('.')[0];
            if (typeId.includes('StrDexInt')) {
                an = `str_dex_int_${base}`;
            } else if (typeId.includes('StrInt')) {
                an = `str_int_${base}`;
            } else if (typeId.includes('StrDex')) {
                an = `str_dex_${base}`;
            } else if (typeId.includes('DexInt')) {
                an = `dex_int_${base}`;
            } else if (typeId.includes('Dex')) {
                an = `dex_${base}`;
            } else if (typeId.includes('Str')) {
                an = `dex_${base}`;
            } else if (typeId.includes('Int')) {
                an = `int_${base}`;
            }

            const itemDetailUrl = `${url}/mod.php?cn=${encodeURIComponent(cn)}&an=${encodeURIComponent(an)}`;
            return itemDetailUrl;
        }

        const q = this.getIdentifier(nameId, typeId);
        const itemUrl = `${url}/search.php?q=${encodeURIComponent(q)}`;
        return itemUrl;
    }

    private getIdentifier(nameId: string, typeId: string): string {
        const name = this.itemService.getName(nameId, Language.English);
        if (name?.length) {
            return name;
        }
        return this.itemService.getType(typeId, Language.English);
    }
}
