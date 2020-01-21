import { Injectable } from '@angular/core';
import { Default } from '../../../../../assets/poe/maps.json';
import { AtlasMapsMap } from '../type';

@Injectable({
    providedIn: 'root'
})
export class MapsProvider {
    public provide(): AtlasMapsMap {
        return Default;
    }
}
