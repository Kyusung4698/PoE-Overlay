import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { environment } from '@env/environment';
import { Language } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import { delay, flatMap, map, retryWhen } from 'rxjs/operators';
import { TradeFetchResult, TradeItemsResult, TradeLeaguesResult, TradeResponse, TradeSearchRequest, TradeSearchResponse, TradeStaticResult, TradeStatsResult } from '../schema/trade';

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;
const RETRY_LIMIT_DELAY = 100;

@Injectable({
    providedIn: 'root'
})
export class TradeHttpService {
    constructor(
        private readonly http: HttpClient,
        private readonly browser: BrowserService) { }

    public getItems(language: Language): Observable<TradeResponse<TradeItemsResult>> {
        const url = this.getApiUrl('data/items', language);
        return this.getAndTransform(url);
    }

    public getLeagues(language: Language): Observable<TradeResponse<TradeLeaguesResult>> {
        const url = this.getApiUrl('data/leagues', language);
        return this.getAndTransform(url);
    }

    public getStatic(language: Language): Observable<TradeResponse<TradeStaticResult>> {
        const url = this.getApiUrl('data/static', language);
        return this.getAndTransform(url);
    }

    public getStats(language: Language): Observable<TradeResponse<TradeStatsResult>> {
        const url = this.getApiUrl('data/stats', language);
        return this.getAndTransform(url);
    }

    public search(request: TradeSearchRequest, language: Language, leagueId: string): Observable<TradeSearchResponse> {
        const url = this.getApiUrl(`search/${encodeURIComponent(leagueId)}`, language);
        return this.http.post(url, request, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retryWhen(errors => errors.pipe(
                flatMap((response: HttpErrorResponse, count) => {
                    if (count >= RETRY_COUNT) {
                        return throwError(response);
                    }
                    if (response.status === 400) {
                        try {
                            const error = JSON.parse(response.error);
                            const message = error?.error?.message || 'no message';
                            const code = error?.error?.code || '-';
                            return throwError(`${code}: ${message}`);
                        } catch{
                            return throwError(response.error);
                        }
                    }
                    if (response.status === 403) {
                        return this.browser.retrieve(url).pipe(
                            map(() => null)
                        );
                    }
                    return of(null).pipe(delay(RETRY_DELAY));
                })
            )),
            map(response => {
                const result = JSON.parse(response.body) as TradeSearchResponse;
                result.url = `${url.replace('/api', '')}/${encodeURIComponent(result.id)}`;
                return result;
            })
        );
    }

    public fetch(itemIds: string[], queryId: string, language: Language): Observable<TradeResponse<TradeFetchResult>> {
        const url = this.getApiUrl(`fetch/${itemIds.join(',')}`, language);
        return this.http.get<TradeResponse<TradeFetchResult>>(url, {
            params: new HttpParams({
                fromObject: {
                    query: queryId
                }
            })
        }).pipe(retryWhen(errors => errors.pipe(
            flatMap((response: HttpErrorResponse) => {
                if (response.status === 400) {
                    try {
                        const error = JSON.parse(response.error);
                        const message = error?.error?.message || 'no message';
                        const code = error?.error?.code || '-';
                        return throwError(`${code}: ${message}`);
                    } catch{
                        return throwError(response.error);
                    }
                }
                if (response.status === 403) {
                    return this.browser.retrieve(url).pipe(
                        map(() => null)
                    );
                }
                if (response.status === 429) {
                    return of(response).pipe(delay(RETRY_LIMIT_DELAY));
                }
                return throwError(response);
            })
        )));
    }

    private getAndTransform<TResponse>(url: string): Observable<TResponse> {
        return this.http.get(url, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retryWhen(errors => errors.pipe(
                flatMap((response: HttpErrorResponse, count) => {
                    if (count >= RETRY_COUNT) {
                        return throwError(response);
                    }
                    if (response.status === 400) {
                        try {
                            const error = JSON.parse(response.error);
                            const message = error?.error?.message || 'no message';
                            const code = error?.error?.code || '-';
                            return throwError(`${code}: ${message}`);
                        } catch{
                            return throwError(response.error);
                        }
                    }
                    if (response.status === 403) {
                        return this.browser.retrieve(url).pipe(
                            map(() => null)
                        );
                    }
                    return of(null).pipe(delay(RETRY_DELAY));
                })
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

}
