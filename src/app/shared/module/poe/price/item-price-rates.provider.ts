import { Injectable } from '@angular/core';
import { StorageCacheService } from '@app/cache';
import { CurrencyOverviewHttpService, CurrencyOverviewType, ItemOverviewHttpService, ItemOverviewType } from '@data/poe-ninja';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemRarity } from '../item';
import { ItemCategory } from '../item/base-item-type';
import { ItemPriceRate, ItemPriceRates } from './item-price-rates';

const CACHE_EXPIRY = 1000 * 60 * 30;

@Injectable({
    providedIn: 'root'
})
export class ItemPriceRatesProvider {
    constructor(
        private readonly currencyService: CurrencyOverviewHttpService,
        private readonly itemService: ItemOverviewHttpService,
        private readonly cache: StorageCacheService) { }

    public provide(leagueId: string, rarity: ItemRarity, category: ItemCategory): Observable<ItemPriceRates> {
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
                        rates: currencies.rates.concat(essences.rates.concat(oil.rates))
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
                return of({ rates: [] });
            case ItemCategory.Flask:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Flask}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueFlask));
                }
                return of({ rates: [] });
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
                return of({ rates: [] });
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
                return of({ rates: [] });
            case ItemCategory.Accessory:
            case ItemCategory.AccessoryAmulet:
            case ItemCategory.AccessoryBelt:
            case ItemCategory.AccessoryRing:
            case ItemCategory.AccessoryTrinket:
                if (rarity === ItemRarity.Unique) {
                    const key = `${leagueId}_${ItemCategory.Accessory}`;
                    return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.UniqueAccessory));
                }
                return of({ rates: [] });
            case ItemCategory.Gem:
            case ItemCategory.GemActivegem:
            case ItemCategory.GemSupportGem:
            case ItemCategory.GemSupportGemplus: {
                const key = `${leagueId}_${ItemCategory.Gem}`;
                return this.fetch(key, () => this.fetchItem(leagueId, ItemOverviewType.SkillGem));
            }
            case ItemCategory.MapScarab:
            case ItemCategory.Leaguestone:
            case ItemCategory.MonsterSample:
            case ItemCategory.CurrencyPiece:
                return of({ rates: [] });
            default:
                // TODO: Add heist rates once poe.ninja supports those
                return of({ rates: [] });
        }
    }

    private fetch(key: string, fetch: () => Observable<ItemPriceRates>): Observable<ItemPriceRates> {
        return this.cache.proxy(`item_category_${key}`, fetch, CACHE_EXPIRY);
    }

    private fetchCurrency(leagueId: string, type: CurrencyOverviewType): Observable<ItemPriceRates> {
        return this.currencyService.get(leagueId, type).pipe(map(response => {
            const result: ItemPriceRates = {
                rates: response.lines.map(line => {
                    const sparkLine = line.receiveSparkLine || {
                        data: [],
                        totalChange: 0
                    };
                    const rate: ItemPriceRate = {
                        name: line.currencyTypeName,
                        type: undefined,
                        links: undefined,
                        mapTier: undefined,
                        gemLevel: undefined,
                        gemQuality: undefined,
                        corrupted: undefined,
                        relic: undefined,
                        change: sparkLine.totalChange,
                        history: sparkLine.data,
                        chaosAmount: line.chaosEquivalent,
                        url: `${response.url}${this.getUrlSuffix(line.currencyTypeName)}`
                    };
                    return rate;
                })
            };
            return result;
        }));
    }

    private fetchItem(leagueId: string, type: ItemOverviewType): Observable<ItemPriceRates> {
        return this.itemService.get(leagueId, type).pipe(map(response => {
            const result: ItemPriceRates = {
                rates: response.lines.map(line => {
                    const sparkLine = line.sparkline || {
                        data: [],
                        totalChange: 0
                    };
                    const rate: ItemPriceRate = {
                        name: line.name,
                        type: line.baseType,
                        mapTier: line.mapTier,
                        corrupted: line.corrupted,
                        gemLevel: line.gemLevel,
                        gemQuality: line.gemQuality,
                        links: line.links,
                        relic: line.itemClass === 9,
                        change: sparkLine.totalChange,
                        history: sparkLine.data,
                        chaosAmount: line.chaosValue,
                        url: `${response.url}${this.getUrlSuffix(line.name)}`
                    };
                    return rate;
                })
            };
            return result;
        }));
    }

    private getUrlSuffix(name: string): string {
        return `?name=${encodeURIComponent(name)}`;
    }
}
