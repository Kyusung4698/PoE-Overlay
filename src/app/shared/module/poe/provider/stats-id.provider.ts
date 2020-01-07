import { Injectable } from '@angular/core';
import { English } from '../../../../../assets/poe/stats-id.json';
import { StatsIdMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class StatsIdProvider {
    public provide(): StatsIdMap {
        // TODO: Export from content.ggpk
        return English;
    }
}
