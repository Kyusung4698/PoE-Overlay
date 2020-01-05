import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { SearchForm, SearchResponse } from '../schema/search';

// Angular replaces + with ' '
class CustomEncoder implements HttpParameterCodec {
    public encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    public encodeValue(value: string): string {
        return encodeURIComponent(value).split('+').join('%2B');
    }

    public decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    public decodeValue(value: string): string {
        return decodeURIComponent(value).split('%2B').join('+');
    }
}

@Injectable({
    providedIn: 'root'
})
export class SearchHttpService {
    private readonly apiUrl: string;

    constructor(private readonly httpClient: HttpClient) {
        this.apiUrl = `${environment.poeTrade.baseUrl}/search`;
    }

    public search(form: SearchForm): Observable<SearchResponse> {
        const params = new HttpParams({
            fromObject: { ...form },
            encoder: new CustomEncoder()
        });
        return this.httpClient.post(this.apiUrl, params, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retry(3),
            map(response => {
                const result: SearchResponse = {
                    items: [],
                    url: response.url
                };

                const el = new DOMParser().parseFromString(response.body, 'text/html');
                const items = el.getElementsByClassName('item');
                for (let i = 0; i < items.length; ++i) {
                    const item = items.item(i);
                    const buyout = (item.getAttribute('data-buyout') || '').trim();
                    if (buyout.length > 0) {
                        result.items.push({
                            value: buyout
                        });
                    }
                }

                return result;
            })
        );
    }
}
