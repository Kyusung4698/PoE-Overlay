import { Injectable } from '@angular/core';
import { Item, ItemProperties, ItemValue } from '../item';

@Injectable({
    providedIn: 'root'
})
export class ItemDamageProcessorService {

    public process(item: Item): void {
        const { properties } = item;
        if (!properties) {
            return;
        }

        const pdps = this.calculatePhysicalDps(properties);
        const edps = this.calculateElementalDps(properties);
        const cdps = this.calculateChaosDps(properties);

        if (!pdps && !edps && !cdps) {
            return;
        }

        const dps: ItemValue = {
            text: '0',
            value: 0
        };
        if (pdps?.tier) {
            dps.tier = { min: 0, max: 0 };
        }

        [pdps, edps, cdps].forEach(range => {
            if (!range) {
                return;
            }

            dps.value += range.value;
            if (dps.tier) {
                if (range.tier) {
                    dps.tier.min += range.tier.min;
                    dps.tier.max += range.tier.max;
                } else {
                    dps.tier.min += range.value;
                    dps.tier.max += range.value;
                }
            }
        });

        dps.text = `${dps.value}`;

        item.damage = { edps, pdps, dps };
    }

    private calculatePhysicalDps(properties: ItemProperties): ItemValue {
        const { weaponPhysicalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponPhysicalDamage) {
            return undefined;
        }

        const damage = weaponPhysicalDamage.value;
        const dps = this.addAps(weaponAttacksPerSecond, damage);
        const range: ItemValue = {
            text: `${dps}`, value: dps
        };

        const { tier } = weaponPhysicalDamage;
        if (tier) {
            range.tier = {
                min: this.addAps(weaponAttacksPerSecond, tier.min),
                max: this.addAps(weaponAttacksPerSecond, tier.max)
            };
        }
        return range;
    }

    private calculateElementalDps(properties: ItemProperties): ItemValue {
        const { weaponElementalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponElementalDamage || weaponElementalDamage.length === 0) {
            return undefined;
        }

        const totalDamage = weaponElementalDamage.reduce((damage, prop) => damage + prop.value, 0);
        const dps = this.addAps(weaponAttacksPerSecond, totalDamage);
        const value: ItemValue = {
            text: `${dps}`, value: dps
        };
        return value;
    }


    private calculateChaosDps(properties: ItemProperties): ItemValue {
        const { weaponChaosDamage, weaponAttacksPerSecond } = properties;
        if (!weaponChaosDamage) {
            return undefined;
        }

        const damage = weaponChaosDamage.value;
        const dps = this.addAps(weaponAttacksPerSecond, damage);
        const value: ItemValue = {
            text: `${dps}`, value: dps
        };
        return value;
    }

    private addAps(prop: ItemValue, damage: number): number {
        const aps = prop ? prop.value : 1;
        const dps = damage * aps;
        return Math.round(dps * 10) / 10;
    }
}
