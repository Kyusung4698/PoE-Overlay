import { Injectable } from '@angular/core';
import { Item, ItemPostParserService, ItemProperty } from '@shared/module/poe/type';

@Injectable({
    providedIn: 'root'
})
export class ItemPostParserDamageService implements ItemPostParserService {

    public process(item: Item): void {
        if (!item.properties) {
            return;
        }

        const pdps = this.calculatePhysicalDps(item);
        const edps = this.calculateElementalDps(item);
        const cdps = this.calculateChaosDps(item);
        if (pdps <= 0 && edps <= 0 && cdps <= 0) {
            return;
        }

        item.damage = {
            edps,
            pdps,
            dps: edps + pdps + cdps
        };
    }

    private calculatePhysicalDps(item: Item): number {
        if (!item.properties.weaponPhysicalDamage) {
            return 0;
        }

        const damage = this.sum(item.properties.weaponPhysicalDamage);
        if (damage <= 0) {
            return 0;
        }
        return this.addAps(item.properties.weaponAttacksPerSecond, damage * 0.5);
    }

    private calculateElementalDps(item: Item): number {
        const damage = this.getElementalSum(item);
        if (damage <= 0) {
            return 0;
        }
        return this.addAps(item.properties.weaponAttacksPerSecond, damage * 0.5);
    }

    private calculateChaosDps(item: Item): number {
        const damage = this.getChaosSum(item);
        if (damage <= 0) {
            return 0;
        }
        return this.addAps(item.properties.weaponAttacksPerSecond, damage * 0.5);
    }

    private getElementalSum(item: Item): number {
        let damage = 0;
        if (item.properties.weaponElementalDamage) {
            item.properties.weaponElementalDamage.forEach(prop => {
                damage = this.sum(prop, damage);
            });
        }
        return damage;
    }

    private getChaosSum(item: Item): number {
        let damage = 0;
        if (item.properties.weaponChaosDamage) {
            damage = this.sum(item.properties.weaponChaosDamage, damage);
        }
        return damage;
    }

    private addAps(prop: ItemProperty, damage: number): number {
        const aps = prop ? +prop.value : 1;
        return damage * aps;
    }

    private sum(prop: ItemProperty, sum: number = 0): number {
        const damage = prop.value.split('-');

        const min = +damage[0];
        const max = +damage[1];
        if (isNaN(min) || isNaN(max)) {
            return sum;
        }
        return sum + min + max;
    }
}
