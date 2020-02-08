import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ItemOverviewResponse } from '../schema/item-overview';

export enum ItemOverviewType {
    Prophecy = 'Prophecy',
    DivinationCard = 'DivinationCard',
    Watchstone = 'Watchstone',
    Incubator = 'Incubator',
    Essence = 'Essence',
    Oil = 'Oil',
    Resonator = 'Resonator',
    UniqueJewel = 'UniqueJewel',
    UniqueFlask = 'UniqueFlask',
    UniqueWeapon = 'UniqueWeapon',
    UniqueArmour = 'UniqueArmour',
    UniqueAccessory = 'UniqueAccessory',
    Beast = 'Beast',
    Fossil = 'Fossil',
    Map = 'Map',
    UniqueMap = 'UniqueMap'
}

@Injectable({
    providedIn: 'root'
})
export class ItemOverviewHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.poeNinja.baseUrl}/data/itemoverview`;
    }

    public get(leagueId: string, type: ItemOverviewType): Observable<ItemOverviewResponse> {
        const params = new HttpParams({
            fromObject: {
                league: leagueId,
                type
            }
        });
        return this.httpClient.get<ItemOverviewResponse>(this.apiUrl, {
            params
        }).pipe(
            retry(3)
        );
    }
}
