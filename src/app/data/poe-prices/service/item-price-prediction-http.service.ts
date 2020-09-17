import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { b64EncodeUnicode } from '@app/helper';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';
import { ItemPricePredictionResponse } from '../schema/item-price-prediction';

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;

const SOURCE = 'poeoverlay';

@Injectable({
    providedIn: 'root'
})
export class ItemPricePredictionHttpService {
    constructor(
        private readonly http: HttpClient) {
    }

    public get(leagueId: string, stringifiedItem: string): Observable<ItemPricePredictionResponse> {
        const base64Item = b64EncodeUnicode(stringifiedItem);
        const encodedLeagueId = encodeURIComponent(leagueId);
        const encodedItem = encodeURIComponent(base64Item);

        const url = `${environment.poePrices.baseUrl}/api?l=${encodedLeagueId}&i=${encodedItem}&s=${SOURCE}`;
        return this.http.get<ItemPricePredictionResponse>(url).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(response, count))
            )),
            mergeMap(response => {
                if (response.error_msg && response.error_msg.length > 0) {
                    return throwError(response.error_msg);
                }
                response.url = `${url}&w=1`;
                return of(response);
            })
        );
    }

    public post(
        leagueId: string,
        stringifiedItem: string,
        selector: 'fair' | 'high' | 'low',
        min: number,
        max: number,
        currencyId: string): Observable<string> {

        const form = new FormData();
        form.set('league', leagueId);
        form.set('min', `${min}`);
        form.set('max', `${max}`);
        form.set('selector', selector);
        form.set('currency', currencyId);
        form.set('qitem_text', b64EncodeUnicode(stringifiedItem));
        form.set('debug', `${environment.production ? 0 : 1}`);
        form.set('source', SOURCE);

        const url = `${environment.poePrices.baseUrl}/send_feedback`;
        return this.http.post<string>(url, form).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(response, count))
            ))
        );
    }

    private handleError(response: HttpErrorResponse, count: number): Observable<void> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }
        return of(null).pipe(delay(RETRY_DELAY));
    }
}
