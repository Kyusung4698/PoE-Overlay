import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { WikiMapsMap } from './wiki-map';

@Injectable({
    providedIn: 'root'
})
export class WikiMapsProvider {
    constructor(private readonly asset: AssetService) { }

    public provide(): WikiMapsMap {
        const content = this.asset.get(Asset.Maps);
        return content.Default;
    }
}
