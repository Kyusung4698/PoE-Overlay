import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeLeaguesHttpLeague } from '@data/poe/schema';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';
import { ItemOverviewResponse } from '../schema/item-overview';
import { OverviewHttpService } from './overview-http.service';

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
    UniqueMap = 'UniqueMap',
    SkillGem = 'SkillGem'
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
    [ItemOverviewType.SkillGem]: 'skill-gems',
};

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;

@Injectable({
    providedIn: 'root'
})
export class ItemOverviewHttpService extends OverviewHttpService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpClient: HttpClient
    ) {
        super();
        this.baseUrl = `${environment.poeNinja.baseUrl}/api/data/itemoverview`;
    }

    public get(leagueId: string, type: ItemOverviewType): Observable<ItemOverviewResponse> {
        const url = this.getUrl(leagueId, type);
        return this.httpClient.get<ItemOverviewResponse>(url).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(response, count))
            )),
            mergeMap(response => {
                if (!response?.lines) {
                    if (leagueId !== TradeLeaguesHttpLeague.Standard) {
                        console.log(`Got empty result from '${url}'. Using Standard league for now.`, response);
                        return this.get(TradeLeaguesHttpLeague.Standard, type);
                    }
                    console.warn(`Got empty result from '${url}'.`, response);
                    return throwError(`Got empty result from '${url}'.`);
                }

                const result: ItemOverviewResponse = {
                    lines: response.lines,
                    url: `${environment.poeNinja.baseUrl}/${this.getLeaguePath(leagueId)}/${PATH_TYPE_MAP[type]}`
                };
                return of(result);
            })
        );
    }

    private handleError(response: HttpErrorResponse, count: number): Observable<void> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }
        return of(null).pipe(delay(RETRY_DELAY));
    }

    private getUrl(leagueId: string, type: ItemOverviewType): string {
        return `${this.baseUrl}?league=${encodeURIComponent(leagueId)}&type=${encodeURIComponent(type)}&language=en`;
    }
}
