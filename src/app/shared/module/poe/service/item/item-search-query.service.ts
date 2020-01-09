import { Injectable } from '@angular/core';
import { Query } from '@data/poe';
import { Item, ItemMod, ItemRarity, Language } from '../../type';
import { StatsDescriptionService } from '../stats-description/stats-description.service';
import { StatsIdService } from '../stats-id/stats-id.service';
import { ItemService } from './item.service';

// TODO: own service per filter type

@Injectable({
    providedIn: 'root'
})
export class ItemSearchQueryService {
    constructor(
        private readonly itemNameService: ItemService,
        private readonly statsDescriptionService: StatsDescriptionService,
        private readonly statsIdService: StatsIdService) { }

    public map(item: Item, language: Language, query: Query) {
        this.mapNameAndType(item, language, query);
        this.mapTypeFilters(item, query);
        this.mapSocketFilters(item, query);
        this.mapWeaponFilters(item, query);
        this.mapArmourFilters(item, query);
        this.mapRequirementsFilters(item, query);
        this.mapMiscsFilters(item, query);
        this.mapMapFilters(item, query);
        this.mapStatsFilters(item, query);
    }

    private mapNameAndType(item: Item, language: Language, query: Query): void {
        const name = this.itemNameService.getName(item.nameId, language);
        if (name) {
            query.name = name;
        }

        const type = this.itemNameService.getType(item.typeId, language);
        if (type) {
            query.type = type;
        }
    }

    private mapTypeFilters(item: Item, query: Query): void {
        // TODO: Add category filters

        query.filters.type_filters = {
            filters: {}
        };

        switch (item.rarity) {
            case ItemRarity.Normal:
            case ItemRarity.Magic:
            case ItemRarity.Rare:
            case ItemRarity.Unique:
                query.filters.type_filters.filters.rarity = {
                    option: item.rarity
                };
                break;
            case ItemRarity.Gem:
                query.filters.type_filters.filters.category = {
                    option: item.rarity,
                };
                break;
            default:
                break;
        }
    }

    private mapSocketFilters(item: Item, query: Query): void {
        const validSockets = (item.sockets || []).filter(x => !!x);
        if (validSockets.length <= 0) {
            return;
        }

        query.filters.socket_filters = {
            filters: {}
        };

        // ignore color for now. just count and linked count.

        const sockets = validSockets.filter(x => !!x.color);
        if (sockets.length > 0) {
            query.filters.socket_filters.filters.sockets = {
                min: sockets.length,
                max: sockets.length
            };
        }

        const links = validSockets.filter(x => !!x.linked);
        if (links.length > 0) {
            query.filters.socket_filters.filters.links = {
                min: links.length + 1,
                max: links.length + 1
            };
        }
    }

    private mapWeaponFilters(item: Item, query: Query): void {
        query.filters.weapon_filters = {
            filters: {}
        };

        const damage = item.damage;
        if (damage) {
            if (damage.dps) {
                query.filters.weapon_filters.filters.dps = {
                    min: damage.dps
                };
            }
            if (damage.edps) {
                query.filters.weapon_filters.filters.edps = {
                    min: damage.edps
                };
            }
            if (damage.pdps) {
                query.filters.weapon_filters.filters.pdps = {
                    min: damage.pdps
                };
            }
        }

        const prop = item.properties;
        if (prop) {
            if (prop.weaponAttacksPerSecond) {
                query.filters.weapon_filters.filters.aps = {
                    min: +prop.weaponAttacksPerSecond.value
                };
            }

            if (prop.weaponCriticalStrikeChance) {
                query.filters.weapon_filters.filters.aps = {
                    min: +(prop.weaponCriticalStrikeChance.value.replace('%', ''))
                };
            }
        }
    }

    private mapArmourFilters(item: Item, query: Query): void {
        const prop = item.properties;
        if (!prop) {
            return;
        }

        query.filters.armour_filters = {
            filters: {}
        };

        if (prop.armourArmour) {
            query.filters.armour_filters.filters.ar = {
                min: +prop.armourArmour.value
            };
        }
        if (prop.armourEvasionRating) {
            query.filters.armour_filters.filters.ev = {
                min: +prop.armourEvasionRating.value
            };
        }
        if (prop.armourEnergyShield) {
            query.filters.armour_filters.filters.es = {
                min: +prop.armourEnergyShield.value
            };
        }
        if (prop.shieldBlockChance) {
            query.filters.armour_filters.filters.block = {
                min: +prop.shieldBlockChance.value
            };
        }
    }

    private mapRequirementsFilters(item: Item, query: Query): void {
        const req = item.requirements;
        if (!req) {
            return;
        }

        query.filters.req_filters = {
            filters: {}
        };

        if (req.level) {
            query.filters.req_filters.filters.lvl = {
                min: req.level
            };
        }
        if (req.str) {
            query.filters.req_filters.filters.str = {
                min: req.str
            };
        }
        if (req.dex) {
            query.filters.req_filters.filters.dex = {
                min: req.dex
            };
        }
        if (req.int) {
            query.filters.req_filters.filters.int = {
                min: req.int
            };
        }
    }

    private mapMiscsFilters(item: Item, query: Query): void {
        query.filters.misc_filters = {
            filters: {}
        };

        if (item.level) {
            query.filters.misc_filters.filters.ilvl = {
                min: item.level,
                max: item.level,
            };
        }

        query.filters.misc_filters.filters.corrupted = {
            option: `${!!item.corrupted}`
        };

        this.mapInfluences(item, query);

        if (!item.properties) {
            return;
        }

        const prop = item.properties;
        if (prop.gemLevel) {
            query.filters.misc_filters.filters.gem_level = {
                min: +prop.gemLevel.value,
                max: +prop.gemLevel.value
            };
        }

        if (prop.gemExperience) {
            const splittedExp = prop.gemExperience.value.split('/');
            const exp = +(splittedExp[0] || '').split('.').join('');
            const expMax = +(splittedExp[1] || '').split('.').join('');
            if (!isNaN(exp) && !isNaN(expMax)) {
                const expFactor = (exp / expMax) * 100;
                query.filters.misc_filters.filters.gem_level_progress = {
                    min: Math.round(expFactor * 100) / 100,
                };
            }
        }

        if (prop.quality) {
            const quality = +prop.quality.value.replace('%', '').replace('+', '');
            if (!isNaN(quality)) {
                query.filters.misc_filters.filters.quality = {
                    min: quality
                };
            }
        }
    }

    private mapMapFilters(item: Item, query: Query): void {
        if (!item.properties) {
            return;
        }

        query.filters.map_filters = {
            filters: {}
        };

        const prop = item.properties;
        if (prop.mapTier) {
            query.filters.map_filters.filters.map_tier = {
                min: +prop.mapTier.value,
                max: +prop.mapTier.value
            };
        }

        if (prop.mapQuantity) {
            query.filters.map_filters.filters.map_iiq = {
                min: +prop.mapQuantity.value.replace('%', '').replace('+', ''),
            };
        }

        if (prop.mapRarity) {
            query.filters.map_filters.filters.map_iir = {
                min: +prop.mapRarity.value.replace('%', '').replace('+', ''),
            };
        }

        if (prop.mapPacksize) {
            query.filters.map_filters.filters.map_packsize = {
                min: +prop.mapPacksize.value.replace('%', '').replace('+', ''),
            };
        }
    }

    private mapStatsFilters(item: Item, query: Query): void {
        const implicits = (item.implicits || []).filter(x => !!x);
        const explicits = (item.explicits || [])
            .filter(group => !!group)
            .reduce((a, group) => a.concat(group.filter(mod => !!mod)), []);

        if (implicits.length > 0 || explicits.length > 0) {
            query.stats = [
                {
                    type: 'and',
                    filters: []
                }
            ];

            if (implicits.length > 0) {
                this.mapMods(implicits, query, 'implicit');
            }
            if (explicits.length > 0) {
                this.mapMods(explicits, query, 'explicits');
            }
        }
    }

    private mapMods(mods: ItemMod[], query: Query, filter: string) {
        const texts = mods.map(mod => {
            return this.statsDescriptionService
                .translate(mod.key, mod.predicate, mod.values.map(x => '#'), Language.English);
        });

        const result = this.statsIdService.searchMultiple(texts);
        result.forEach((value, index) => {
            if (value && value.ids) {
                const filterId = value.ids.find(x => x.startsWith(filter));

                const id = filterId ? filterId : value.ids[0];
                const mod = mods[index];
                const min = +mod.values[0].replace('%', '');
                if (!isNaN(min)) {
                    query.stats[0].filters.push({
                        disabled: false,
                        id,
                        value: { min }
                    });
                }
            }
        });
    }

    private mapInfluences(item: Item, query: Query): void {
        if (!item.influences) {
            return;
        }

        if (item.influences.shaper) {
            query.filters.misc_filters.filters.shaper_item = {
                option: `${!!item.influences.shaper}`
            };
        }
        if (item.influences.crusader) {
            query.filters.misc_filters.filters.crusader_item = {
                option: `${!!item.influences.crusader}`
            };
        }
        if (item.influences.hunter) {
            query.filters.misc_filters.filters.hunter_item = {
                option: `${!!item.influences.hunter}`
            };
        }
        if (item.influences.elder) {
            query.filters.misc_filters.filters.elder_item = {
                option: `${!!item.influences.elder}`
            };
        }
        if (item.influences.redeemer) {
            query.filters.misc_filters.filters.redeemer_item = {
                option: `${!!item.influences.redeemer}`
            };
        }
        if (item.influences.warlord) {
            query.filters.misc_filters.filters.warlord_item = {
                option: `${!!item.influences.warlord}`
            };
        }
    }
}
