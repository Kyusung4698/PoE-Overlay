import { Injectable } from '@angular/core';
import { MapsProvider } from '../../provider/maps.provider';
import { AtlasMap, Language } from '../../type';
import { ItemService } from '../item/item.service';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    constructor(
        private readonly mapsProvider: MapsProvider,
        private readonly itemService: ItemService) { }

    public get(typeId: string): AtlasMap {
        const maps = this.mapsProvider.provide();
        const type = this.itemService.getType(typeId, Language.English);
        return maps[type];
    }
}
