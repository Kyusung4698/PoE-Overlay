import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { Language, TradeExchangeHttpRequest, TradeExchangeHttpResponse, TradeFetchHttpResponse, TradeItemsHttpResponse, TradeLeaguesHttpResponse, TradeSearchHttpRequest, TradeSearchHttpResponse, TradeStaticHttpResponse, TradeStatsHttpResponse } from '../schema';
import { TradeRateLimitService } from './trade-rate-limit.service';

const RETRY_COUNT = 3;
const RETRY_DELAY = 300;

@Injectable({
    providedIn: 'root'
})
export class TradeHttpService {
    constructor(
        private readonly http: HttpClient,
        private readonly limit: TradeRateLimitService) { }

    public getItems(language: Language): Observable<TradeItemsHttpResponse> {
        const url = this.getApiUrl('data/items', language);
        return this.getAndTransform(url);
    }

    public getLeagues(language: Language): Observable<TradeLeaguesHttpResponse> {
        const url = this.getApiUrl('data/leagues', language);
        return this.getAndTransform(url);
    }

    public getStatics(language: Language): Observable<TradeStaticHttpResponse> {
        const url = this.getApiUrl('data/static', language);
        return this.getAndTransform(url);
    }

    public getStats(language: Language): Observable<TradeStatsHttpResponse> {
        const url = this.getApiUrl('data/stats', language);
        return this.getAndTransform(url);
    }

    public exchange(request: TradeExchangeHttpRequest, language: Language, leagueId: string): Observable<TradeExchangeHttpResponse> {
        const path = 'exchange';
        const url = this.getApiUrl(`${path}/${encodeURIComponent(leagueId)}`, language);
        return this.limit.throttle(path, () => this.http.post<TradeExchangeHttpResponse>(url, request, {
            withCredentials: true,
            observe: 'response'
        })).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(url, response, count))
            )),
            map(response => {
                response.url = `${url.replace('/api', '')}/${encodeURIComponent(response.id)}`;
                return response;
            })
        );
    }

    public search(request: TradeSearchHttpRequest, language: Language, leagueId: string): Observable<TradeSearchHttpResponse> {
        const path = 'search';
        const url = this.getApiUrl(`${path}/${encodeURIComponent(leagueId)}`, language);
        return this.limit.throttle(path, () => this.http.post<TradeSearchHttpResponse>(url, request, {
            withCredentials: true,
            observe: 'response'
        })).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(url, response, count))
            )),
            map(response => {
                response.url = `${url.replace('/api', '')}/${encodeURIComponent(response.id)}`;
                return response;
            })
        );
    }

    public fetch(ids: string[], query: string, language: Language, exchange: boolean = false): Observable<TradeFetchHttpResponse> {
        const params: any = { query };
        if (exchange) {
            params.exchange = undefined;
        }
        const path = 'fetch';
        const url = this.getApiUrl(`${path}/${ids.join(',')}`, language);
        return this.limit.throttle(path, () => this.http.get<TradeFetchHttpResponse>(url, {
            params: new HttpParams({
                fromObject: params
            }),
            withCredentials: true,
            observe: 'response'
        })).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(url, response, count))
            ))
        );
    }

    private getAndTransform<TResponse>(url: string): Observable<TResponse> {
        return this.http.get(url, {
            observe: 'response',
            responseType: 'text',
            withCredentials: true
        }).pipe(
            retryWhen(errors => errors.pipe(
                mergeMap((response, count) => this.handleError(url, response, count))
            )),
            map(response => this.transformResponse(response))
        );
    }

    private transformResponse<TResponse>(response: HttpResponse<string>): TResponse {
        const result = response.body.replace(
            /\\u[\dA-Fa-f]{4}/g,
            (match) => String.fromCharCode(
                parseInt(match.replace(/\\u/g, ''), 16))
        );
        return JSON.parse(result) as TResponse;
    }

    private getApiUrl(postfix: string, language: Language): string {
        let baseUrl = environment.poe.baseUrl;
        switch (language) {
            case Language.English:
                break;
            case Language.Portuguese:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'br');
                break;
            case Language.Russian:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'ru');
                break;
            case Language.Thai:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'th');
                break;
            case Language.German:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'de');
                break;
            case Language.French:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'fr');
                break;
            case Language.Spanish:
                baseUrl = environment.poe.countryUrl.replace('{country}', 'es');
                break;
            case Language.Korean:
                baseUrl = environment.poe.koreanUrl;
                break;
            // case Language.SimplifiedChinese:
            //     baseUrl = environment.poe.simplifiedChineseUrl;
            //     break;
            case Language.TraditionalChinese:
                baseUrl = environment.poe.traditionalChineseUrl;
                break;
            default:
                throw new Error(`Could not map baseUrl to language: '${language}'.`);
        }
        return `${baseUrl}/trade/${postfix}`;
    }

    private handleError(url: string, response: HttpErrorResponse, count: number): Observable<HttpErrorResponse> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }

        switch (response.status) {
            case 400:
                try {
                    const message = response?.error?.error?.message || 'no message';
                    const code = response?.error?.error?.code || '-';
                    return throwError(`${code}: ${message}`);
                } catch {
                    return throwError(response.error);
                }
            case 429:
                return throwError(response);
            default:
                return of(response).pipe(delay(RETRY_DELAY));
        }
    }

}
