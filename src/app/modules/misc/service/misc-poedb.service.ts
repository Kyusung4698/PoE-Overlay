import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { environment } from '@env/environment';
import { SnackBarService } from '@shared/module/material/service';
import { ItemClipboardResultCode, ItemClipboardService, ItemService } from '@shared/module/poe/service';
import { ItemCategory, ItemRarity, ItemSection, Language } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';

const CATEGORY_CN_MAP = {
    [ItemCategory.ArmourBoots]: 'Boots',
    [ItemCategory.ArmourChest]: 'Body Armour',
    [ItemCategory.ArmourGloves]: 'Gloves',
    [ItemCategory.ArmourHelmet]: 'Helmets',
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
}

@Injectable({
    providedIn: 'root'
})
export class MiscPoedbService {

    constructor(
        private readonly itemClipboard: ItemClipboardService,
        private readonly itemService: ItemService,
        private readonly browser: BrowserService,
        private readonly snackbar: SnackBarService) {
    }

    public open(external: boolean): Observable<void> {
        return this.itemClipboard.copy({
            [ItemSection.Rartiy]: true
        }).pipe(
            flatMap(result => {
                switch (result.code) {
                    case ItemClipboardResultCode.Success:

                        const cn = CATEGORY_CN_MAP[result.item.category]
                        if (result.item.rarity === ItemRarity.Rare && !!cn) {
                            let an = '';

                            const category = result.item.category.split('.')[0];
                            const typeId = result.item.typeId;
                            if (typeId.includes('StrDexInt')) {
                                an = `str_dex_int_${category}`
                            } else if (typeId.includes('StrInt')) {
                                an = `str_int_${category}`
                            } else if (typeId.includes('StrDex')) {
                                an = `str_dex_${category}`
                            } else if (typeId.includes('DexInt')) {
                                an = `dex_int_${category}`
                            } else if (typeId.includes('Dex')) {
                                an = `dex_${category}`
                            } else if (typeId.includes('Str')) {
                                an = `dex_${category}`
                            } else if (typeId.includes('Int')) {
                                an = `int_${category}`
                            }

                            const url = `${environment.poedb.baseUrl}/mod.php?cn=${encodeURIComponent(cn)}&an=${encodeURIComponent(an)}`;
                            this.browser.open(url, external);
                            return of(null);
                        }

                        let search = this.itemService.getName(result.item.nameId, Language.English) || '';
                        if (search.length === 0) {
                            search = this.itemService.getType(result.item.typeId, Language.English);
                        }
                        this.browser.open(`${environment.poedb.baseUrl}/search.php?q=${encodeURIComponent(search)}`, external);

                        return of(null);
                    case ItemClipboardResultCode.Empty:
                        return this.snackbar.warning('clipboard.empty');
                    case ItemClipboardResultCode.ParserError:
                        return this.snackbar.warning('clipboard.parser-error');
                    default:
                        return throwError(`code: '${result.code}' out of range`);
                }
            }),
            catchError(() => {
                return this.snackbar.error('clipboard.parser-error');
            })
        );
    }
}
