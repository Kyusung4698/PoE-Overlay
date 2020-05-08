import { Injectable } from '@angular/core';
import { Item, ItemProperties, ItemValue, ItemValueProperty } from '@shared/module/poe/type';

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
            dps.tier = { min: 0, max: 0 }
        }

        [pdps, edps, cdps].forEach(range => {
            if (!range) {
                return;
            }

            dps.text = `${+dps.text + +range.text}`;
            dps.value += range.value;
            if (!dps.tier) {
                return;
            }

            if (range.tier) {
                dps.tier.min += range.tier.min;
                dps.tier.max += range.tier.max;
            } else {
                dps.tier.min += range.value;
                dps.tier.max += range.value;
            }
        });
        dps.text = `${Math.round(+dps.text * 10) / 10}`;

        item.damage = { edps, pdps, dps };
    }

    private calculatePhysicalDps(properties: ItemProperties): ItemValue {
        const { weaponPhysicalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponPhysicalDamage) {
            return undefined;
        }

        const damage = this.sum(weaponPhysicalDamage);
        const dps = this.addAps(weaponAttacksPerSecond, damage);

        const range: ItemValue = {
            text: `${dps}`, value: dps
        };

        const { value, tier } = weaponPhysicalDamage.value;
        if (value) {
            range.value = this.addAps(weaponAttacksPerSecond, value);
        }
        if (tier) {
            range.tier = {
                min: this.addAps(weaponAttacksPerSecond, tier.min),
                max: this.addAps(weaponAttacksPerSecond, tier.max)
            }
        }
        return range;
    }

    private calculateElementalDps(properties: ItemProperties): ItemValue {
        const { weaponElementalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponElementalDamage || weaponElementalDamage.length === 0) {
            return undefined;
        }

        const totalDamage = weaponElementalDamage.reduce((damage, prop) => this.sum(prop, damage), 0);
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

        const damage = this.sum(weaponChaosDamage)
        const dps = this.addAps(weaponAttacksPerSecond, damage);

        const value: ItemValue = {
            text: `${dps}`, value: dps
        };
        return value;
    }

    private addAps(prop: ItemValueProperty, damage: number): number {
        const aps = prop ? +prop.value.text : 1;
        const dps = damage * 0.5 * aps;
        return Math.round(dps * 10) / 10;
    }

    private sum(prop: ItemValueProperty, sum: number = 0): number {
        return prop.value.text
            .split('-')
            .map(x => +x.replace('%', ''))
            .reduce((a, b) => a + b, sum);
    }
}
