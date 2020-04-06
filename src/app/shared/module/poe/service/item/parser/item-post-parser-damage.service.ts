import { Injectable } from '@angular/core';
import { Item, ItemPostParserService, ItemProperties, ItemValue, ItemValueProperty } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemPostParserDamageService implements ItemPostParserService {

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
            text: '',
            tier: {
                min: 0,
                max: 0
            }
        };

        [pdps, edps, cdps].forEach(value => {
            if (value) {
                dps.text = `${+dps.text + +value.text}`;
                if (value.tier) {
                    dps.tier.min += value.tier.min;
                    dps.tier.max += value.tier.max;
                } else {
                    dps.tier.min += +value.text;
                    dps.tier.max += +value.text;
                }
            }
        });

        item.damage = { edps, pdps, dps };
    }

    private calculatePhysicalDps(properties: ItemProperties): ItemValue {
        const { weaponPhysicalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponPhysicalDamage) {
            return undefined;
        }

        const damage = this.sum(weaponPhysicalDamage);
        const dps = this.addAps(weaponAttacksPerSecond, damage);

        const value: ItemValue = {
            text: `${dps}`,
            tier: {
                min: this.addAps(weaponAttacksPerSecond, weaponPhysicalDamage.value.tier.min),
                max: this.addAps(weaponAttacksPerSecond, weaponPhysicalDamage.value.tier.max),
            }
        };
        return value;
    }

    private calculateElementalDps(properties: ItemProperties): ItemValue {
        const { weaponElementalDamage, weaponAttacksPerSecond } = properties;
        if (!weaponElementalDamage || weaponElementalDamage.length === 0) {
            return undefined;
        }

        const totalDamage = weaponElementalDamage.reduce((damage, prop) => this.sum(prop, damage), 0);
        const dps = this.addAps(weaponAttacksPerSecond, totalDamage);

        const value: ItemValue = {
            text: `${dps}`
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
            text: `${dps}`
        };
        return value;
    }

    private addAps(prop: ItemValueProperty, damage: number): number {
        const aps = prop ? +prop.value.text : 1;
        return damage * 0.5 * aps;
    }

    private sum(prop: ItemValueProperty, sum: number = 0): number {
        const damage = prop.value.text.split('-');

        const min = +damage[0];
        const max = +damage[1];
        if (isNaN(min) || isNaN(max)) {
            return sum;
        }
        return sum + min + max;
    }
}
