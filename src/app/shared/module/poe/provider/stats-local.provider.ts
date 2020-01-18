import { Injectable } from '@angular/core';
import { crafted, delve, enchant, explicit, fractured, implicit, monster, pseudo, veiled } from '../../../../../assets/poe/stats-local.json';
import { StatLocalMap, StatType } from '../type';

@Injectable({
    providedIn: 'root'
})
export class StatsLocalProvider {
    public provide(group: StatType): StatLocalMap {
        switch (group) {
            case StatType.Pseudo:
                return pseudo;
            case StatType.Explicit:
                return explicit;
            case StatType.Implicit:
                return implicit;
            case StatType.Crafted:
                return crafted;
            case StatType.Fractured:
                return fractured;
            case StatType.Enchant:
                return enchant;
            case StatType.Veiled:
                return veiled;
            case StatType.Monster:
                return monster;
            case StatType.Delve:
                return delve;
        }
    }
}
