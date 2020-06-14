import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { StatMap, StatType } from './stat';

@Injectable({
    providedIn: 'root'
})
export class StatsProvider {

    constructor(private readonly asset: AssetService) { }

    public provide(group: StatType): StatMap {
        const content = this.asset.get(Asset.Stats);
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
