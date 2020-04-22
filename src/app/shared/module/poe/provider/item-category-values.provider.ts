import { Injectable } from '@angular/core';
import { CacheService } from '@app/service';
import { CurrencyOverviewHttpService, CurrencyOverviewType, ItemOverviewHttpService, ItemOverviewType } from '@data/poe-ninja';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemCategory, ItemRarity } from '../type';

export interface ItemCategoryValue {
    name: string;
    type: string;
    mapTier: number;
    links: number;
    relic: boolean;
    chaosAmount: number;
    change: number;
    history: number[];
    url: string;
}

export interface ItemCategoryValues {
    values: ItemCategoryValue[];
}

const CACHE_EXPIRY = 1000 * 60 * 30;

@Injectable({
    providedIn: 'root'
})
export class ItemCategoryValuesProvider {
    constructor(
        private readonly currencyService: CurrencyOverviewHttpService,
        private readonly itemService: ItemOverviewHttpService,
        private readonly cache: CacheService) { }

    public provide(leagueId: string, rarity: ItemRarity, category: ItemCategory): Observable<ItemCategoryValues> {
        switch (category) {
            case ItemCategory.Map: {
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Map}_${ItemRarity.Unique}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueMap));
                } else {
                    const key = `${leagueId}_${ItemCategory.Map}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Map));
                }
            }
            case ItemCategory.Prophecy: {
                const key = `${leagueId}_${ItemCategory.Prophecy}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Prophecy));
            }
            case ItemCategory.Card: {
                const key = `${leagueId}_${ItemCategory.Card}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.DivinationCard));
            }
            case ItemCategory.Currency: {
                const key = `${leagueId}_${ItemCategory.Currency}`;
                return forkJoin([
                    this.fetch(key, () => this.fetchCurrency(leagueId, CurrencyOverviewType.Currency)),
                    this.fetch(`${key}_essence`, () => this.fetchItem(leagueId, ItemOverviewType.Essence)),
                    this.fetch(`${key}_oil`, () => this.fetchItem(leagueId, ItemOverviewType.Oil))
                ]).pipe(map(([currencies, essences, oil]) => {
                    return {
                        values: currencies.values.concat(essences.values.concat(oil.values))
                    };
                }));
            }
            case ItemCategory.MapFragment: {
                const key = `${leagueId}_${ItemCategory.MapFragment}`;
                return this.fetch(key, () => this.fetchCurrency(leagueId, CurrencyOverviewType.Fragment));
            }
            case ItemCategory.Watchstone: {
                const key = `${leagueId}_${ItemCategory.Watchstone}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Watchstone));
            }
            case ItemCategory.CurrencyFossil: {
                const key = `${leagueId}_${ItemCategory.CurrencyFossil}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Fossil));
            }
            case ItemCategory.CurrencyResonator: {
                const key = `${leagueId}_${ItemCategory.CurrencyResonator}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Resonator));
            }
            case ItemCategory.CurrencyIncubator: {
                const key = `${leagueId}_${ItemCategory.CurrencyIncubator}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Incubator));
            }
            case ItemCategory.MonsterBeast: {
                const key = `${leagueId}_${ItemCategory.MonsterBeast}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.Beast));
            }
            case ItemCategory.Jewel:
            case ItemCategory.JewelAbyss:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Jewel}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueJewel));
                }
                return of({ values: [] });
            case ItemCategory.Flask:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Flask}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueFlask));
                }
                return of({ values: [] });
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
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Weapon}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueWeapon));
                }
                return of({ values: [] });
            case ItemCategory.Armour:
            case ItemCategory.ArmourChest:
            case ItemCategory.ArmourBoots:
            case ItemCategory.ArmourGloves:
            case ItemCategory.ArmourHelmet:
            case ItemCategory.ArmourShield:
            case ItemCategory.ArmourQuiver:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Armour}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueArmour));
                }
                return of({ values: [] });
            case ItemCategory.Accessory:
            case ItemCategory.AccessoryAmulet:
            case ItemCategory.AccessoryBelt:
            case ItemCategory.AccessoryRing:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Accessory}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueAccessory));
                }
                return of({ values: [] });
            case ItemCategory.Gem:
            case ItemCategory.GemActivegem:
            case ItemCategory.GemSupportGem:
            case ItemCategory.GemSupportGemplus:
            case ItemCategory.MapScarab:
            case ItemCategory.Leaguestone:
            case ItemCategory.MonsterSample:
            case ItemCategory.CurrencyPiece:
                return of({ values: [] });
        }
    }

    private fetch(key: string, fetch: () => Observable<ItemCategoryValues>): Observable<ItemCategoryValues> {
        return this.cache.proxy(`item_category_${key}`, fetch, CACHE_EXPIRY);
    }

    private fetchCurrency(leagueId: string, type: CurrencyOverviewType): Observable<ItemCategoryValues> {
        return this.currencyService.get(leagueId, type).pipe(map(response => {
            const result: ItemCategoryValues = {
                values: response.lines.map(line => {
                    const sparkLine = line.receiveSparkLine || {
                        data: [],
                        totalChange: 0
                    };
                    const value: ItemCategoryValue = {
                        name: line.currencyTypeName,
                        type: undefined,
                        links: undefined,
                        mapTier: undefined,
                        relic: undefined,
                        change: sparkLine.totalChange,
                        history: sparkLine.data,
                        chaosAmount: line.chaosEquivalent,
                        url: response.url
                    };
                    return value;
                })
            };
            return result;
        }));
    }

    private fetchItem(leagueId: string, type: ItemOverviewType): Observable<ItemCategoryValues> {
        return this.itemService.get(leagueId, type).pipe(map(response => {
            const result: ItemCategoryValues = {
                values: response.lines.map(line => {
                    const sparkLine = line.sparkline || {
                        data: [],
                        totalChange: 0
                    };
                    const value: ItemCategoryValue = {
                        name: line.name,
                        type: line.baseType,
                        mapTier: line.mapTier,
                        links: line.links,
                        relic: line.itemClass === 9,
                        change: sparkLine.totalChange,
                        history: sparkLine.data,
                        chaosAmount: line.chaosValue,
                        url: response.url
                    };
                    return value;
                })
            };
            return result;
        }));
    }
}
