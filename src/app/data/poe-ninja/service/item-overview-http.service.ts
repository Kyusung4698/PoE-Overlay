import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
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

const PATH_TYPE_MAP = {
    [ItemOverviewType.Prophecy]: 'prophecies',
    [ItemOverviewType.DivinationCard]: 'divinationcards',
    [ItemOverviewType.Watchstone]: 'watchstones',
    [ItemOverviewType.Incubator]: 'incubators',
    [ItemOverviewType.Essence]: 'essences',
    [ItemOverviewType.Oil]: 'oils',
    [ItemOverviewType.Resonator]: 'resonators',
    [ItemOverviewType.UniqueJewel]: 'unique-jewels',
    [ItemOverviewType.UniqueFlask]: 'unique-flaks',
    [ItemOverviewType.UniqueWeapon]: 'unique-weapons',
    [ItemOverviewType.UniqueArmour]: 'unique-armours',
    [ItemOverviewType.UniqueAccessory]: 'unique-accessories',
    [ItemOverviewType.Beast]: 'beats',
    [ItemOverviewType.Fossil]: 'fossils',
    [ItemOverviewType.Map]: 'maps',
    [ItemOverviewType.UniqueMap]: 'unique-maps',
};

@Injectable({
    providedIn: 'root'
})
export class ItemOverviewHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.poeNinja.baseUrl}/api/data/itemoverview`;
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
            retry(3),
            map(result => {
                return {
                    ...result,
                    url: `${environment.poeNinja.baseUrl}/challenge/${PATH_TYPE_MAP[type]}`
                }
            })
        );
    }
}
