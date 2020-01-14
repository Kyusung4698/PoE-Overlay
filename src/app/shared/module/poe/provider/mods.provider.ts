import { Injectable } from '@angular/core';
import { Default } from '../../../../../assets/poe/mods.json';
import { ModsMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class ModsProvider {
    public provide(): ModsMap {
        return Default;
    }
}