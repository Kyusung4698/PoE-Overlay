import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { TradeItemsResult, TradeLeaguesResult, TradeResponse, TradeStaticResult, TradeStatsResult } from '../schema/trade';

@Injectable({
    providedIn: 'root'
})
export class TradeHttpService {
    constructor(private readonly http: HttpClient) { }

    public getItems(language: Language): Observable<TradeResponse<TradeItemsResult>> {
        const url = this.getApiUrl('data/items', language);
        return this.get(url);
    }

    public getLeagues(language: Language): Observable<TradeResponse<TradeLeaguesResult>> {
        const url = this.getApiUrl('data/leagues', language);
        return this.get(url);
    }

    public getStatic(language: Language): Observable<TradeResponse<TradeStaticResult>> {
        const url = this.getApiUrl('data/static', language);
        return this.get(url);
    }

    public getStats(language: Language): Observable<TradeResponse<TradeStatsResult>> {
        const url = this.getApiUrl('data/stats', language);
        return this.get(url);
    }

    private get<TResponse>(url: string): Observable<TResponse> {
        return this.http.get(url, {
            responseType: 'text',
            observe: 'response'
        }).pipe(
            retry(3),
            map(response => {
                const result = response.body.replace(
                    /\\u[\dA-Fa-f]{4}/g,
                    (match) => String.fromCharCode(
                        parseInt(match.replace(/\\u/g, ''), 16))
                );
                return JSON.parse(result) as TResponse;
            })
        );
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
            default:
                throw new Error(`Could not map baseUrl to language: '${language}'.`);
        }
        return `${baseUrl}/trade/${postfix}`;
    }
}
