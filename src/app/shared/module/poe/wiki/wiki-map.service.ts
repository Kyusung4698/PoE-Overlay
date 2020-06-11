import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ItemService } from '../item';
import { WikiMap } from './wiki-map';
import { WikiMapsProvider } from './wiki-maps.provider';

@Injectable({
    providedIn: 'root'
})
export class WikiMapService {
    constructor(
        private readonly mapsProvider: WikiMapsProvider,
        private readonly itemService: ItemService) { }

    public get(typeId: string): WikiMap {
        const maps = this.mapsProvider.provide();
        const type = this.itemService.getType(typeId, Language.English);
        return maps[type];
    }

    public find(nameId: string, typeId: string): string[] {
        const maps = this.mapsProvider.provide();
        const name = this.itemService.getNameType(nameId, typeId, Language.English);
        return Object.getOwnPropertyNames(maps)
            .filter(key => {
                const map = maps[key];
                return map.items && map.items.some(item => item === name);
            });
    }
}
