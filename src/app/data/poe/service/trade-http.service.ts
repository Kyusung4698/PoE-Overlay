import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserService, LoggerService, SessionService, StorageService } from '@app/service';
import { environment } from '@env/environment';
import { Language } from '@shared/module/poe/type';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, flatMap, map, retryWhen } from 'rxjs/operators';
import { TradeFetchResult, TradeItemsResult, TradeLeaguesResult, TradeResponse, TradeSearchRequest, TradeSearchResponse, TradeStaticResult, TradeStatsResult } from '../schema/trade';

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;
const RETRY_LIMIT_DELAY = 300;
const RETRY_LIMIT_DELAY_FACTOR = [1, 2, 4];

@Injectable({
    providedIn: 'root'
})
export class TradeHttpService {
    constructor(
        private readonly http: HttpClient,
        private readonly browser: BrowserService,
        private readonly session: SessionService,
        private readonly storage: StorageService,
        private readonly logger: LoggerService) { }

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
                flatMap((response, count) => this.handleError(url, response, count))
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
            flatMap((response, count) => this.handleError(url, response, count))
        )));
    }

    private getAndTransform<TResponse>(url: string): Observable<TResponse> {
        return this.http.get(url, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retryWhen(errors => errors.pipe(
                flatMap((response, count) => this.handleError(url, response, count))
            )),
            catchError(error => this.storage.get<HttpResponse<string>>(url).pipe(
                flatMap(cachedResponse => {
                    if (cachedResponse) {
                        this.logger.warn(`Could not fetch response from: '${url}'. Using cached data for now...`, error);
                        return of(cachedResponse);
                    }
                    return throwError(error);
                })
            )),
            flatMap(response => this.storage.saveCopy(url, response)),
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

    private handleError(url: string, response: HttpErrorResponse, count: number): Observable<any> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }

        switch (response.status) {
            case 400:
                try {
                    const error = JSON.parse(response.error);
                    const message = error?.error?.message || 'no message';
                    const code = error?.error?.code || '-';
                    return throwError(`${code}: ${message}`);
                } catch{
                    return throwError(response.error);
                }
            case 403:
                return this.browser.retrieve(url).pipe(delay(RETRY_DELAY));
            case 429:
                return of(null).pipe(delay(RETRY_LIMIT_DELAY * RETRY_LIMIT_DELAY_FACTOR[count]));
            default:
                return this.session.clear().pipe(delay(RETRY_DELAY));
        }
    }

}
