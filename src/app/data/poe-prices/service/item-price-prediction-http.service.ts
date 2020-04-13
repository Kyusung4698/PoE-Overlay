import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserService, SessionService } from '@app/service';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, flatMap, retryWhen } from 'rxjs/operators';
import { ItemPricePredictionResponse } from '../schema/item-price-prediction';

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionHttpService {
    private readonly baseUrl: string;

    constructor(
        private readonly http: HttpClient,
        private readonly session: SessionService,
        private readonly browser: BrowserService) {
        this.baseUrl = `${environment.poePrices.baseUrl}/api`;
    }

    public get(leagueId: string, stringifiedItem: string): Observable<ItemPricePredictionResponse> {
        const url = this.getUrl(leagueId, stringifiedItem);
        return this.http.get<ItemPricePredictionResponse>(url).pipe(
            retryWhen(errors => errors.pipe(
                flatMap((response, count) => this.handleError(url, response, count))
            )),
            flatMap(response => {
                if (response.error_msg && response.error_msg.length > 0) {
                    return throwError(response.error_msg);
                }
                return of(response);
            })
        );
    }

    private getUrl(leagueId: string, stringifiedItem: string): string {
        const base64Item = btoa(stringifiedItem);
        const encodedLeagueId = encodeURIComponent(leagueId);
        const encodedItem = encodeURIComponent(base64Item);
        return `${this.baseUrl}?l=${encodedLeagueId}&i=${encodedItem}`;
    }

    private handleError(url: string, response: HttpErrorResponse, count: number): Observable<void> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }

        switch (response.status) {
            case 403:
                return this.browser.retrieve(url).pipe(delay(RETRY_DELAY));
            default:
                return this.session.clear().pipe(delay(RETRY_DELAY));
        }
    }
}