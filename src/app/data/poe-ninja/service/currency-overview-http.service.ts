import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { CurrencyOverviewResponse } from '../schema/currency-overview';

export enum CurrencyOverviewType {
    Currency = 'Currency',
    Fragment = 'Fragment'
}

const PATH_TYPE_MAP = {
    [CurrencyOverviewType.Currency]: 'currency',
    [CurrencyOverviewType.Fragment]: 'fragments',
};

@Injectable({
    providedIn: 'root'
})
export class CurrencyOverviewHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.poeNinja.baseUrl}/api/data/currencyoverview`;
    }

    public get(leagueId: string, type: CurrencyOverviewType): Observable<CurrencyOverviewResponse> {
        const params = new HttpParams({
            fromObject: {
                league: leagueId,
                type
            }
        });
        return this.httpClient.get<CurrencyOverviewResponse>(this.apiUrl, {
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
