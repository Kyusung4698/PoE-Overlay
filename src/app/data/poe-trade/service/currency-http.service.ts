import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { CurrencyResponse } from '../schema/currency';

@Injectable({
    providedIn: 'root'
})
export class CurrencyHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.currencyPoeTrade.baseUrl}`;
    }

    public get(): Observable<CurrencyResponse> {
        return this.httpClient.get(this.apiUrl, {
            responseType: 'text',
        }).pipe(
            retry(3),
            map(response => {
                const result: CurrencyResponse = {
                    currencies: []
                };
                const el = new DOMParser().parseFromString(response, 'text/html');
                const items = el.getElementsByClassName('currency-selectable');
                for (let i = 0; i < items.length; ++i) {
                    const item = items.item(i);
                    const text = (item.getAttribute('title') || '').trim();
                    const title = (item.getAttribute('data-title') || '').trim();
                    if (text.length > 0 && title.length > 0) {
                        result.currencies.push({
                            text,
                            title
                        });
                    }
                }
                return result;
            })
        );
    }
}
