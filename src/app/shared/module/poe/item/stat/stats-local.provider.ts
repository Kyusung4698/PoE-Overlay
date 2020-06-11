import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { StatType } from './stat';
import { StatLocalMap } from './stat-local';

@Injectable({
    providedIn: 'root'
})
export class StatsLocalProvider {

    constructor(private readonly asset: AssetService) { }

    public provide(group: StatType): StatLocalMap {
        const content = this.asset.get(Asset.StatsLocal);
        switch (group) {
            case StatType.Pseudo:
                return content.pseudo;
            case StatType.Explicit:
                return content.explicit;
            case StatType.Implicit:
                return content.implicit;
            case StatType.Crafted:
                return content.crafted;
            case StatType.Fractured:
                return content.fractured;
            case StatType.Enchant:
                return content.enchant;
            case StatType.Veiled:
                return content.veiled;
            case StatType.Monster:
                return content.monster;
            case StatType.Delve:
                return content.delve;
        }
    }
}
