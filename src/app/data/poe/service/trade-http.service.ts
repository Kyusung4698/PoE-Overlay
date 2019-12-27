import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { TradeItemsResult, TradeLeaguesResult, TradeResponse, TradeStaticResult, TradeStatsResult } from '../schema/trade';

@Injectable({
    providedIn: 'root'
})
export class TradeHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.poe.baseUrl}/trade`;
    }

    public getItems(): Observable<TradeResponse<TradeItemsResult>> {
        const url = `${this.apiUrl}/data/items`;
        return this.httpClient.get<TradeResponse<TradeItemsResult>>(url);
    }

    public getLeagues(): Observable<TradeResponse<TradeLeaguesResult>> {
        const url = `${this.apiUrl}/data/leagues`;
        return this.httpClient.get<TradeResponse<TradeLeaguesResult>>(url);
    }

    public getStatic(): Observable<TradeResponse<TradeStaticResult>> {
        const url = `${this.apiUrl}/data/static`;
        return this.httpClient.get<TradeResponse<TradeStaticResult>>(url);
    }

    public getStats(): Observable<TradeResponse<TradeStatsResult>> {
        const url = `${this.apiUrl}/data/stats`;
        return this.httpClient.get<TradeResponse<TradeStatsResult>>(url);
    }
}
