import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserService, LoggerService, SessionService } from '@app/service';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, flatMap, retryWhen } from 'rxjs/operators';
import { CurrencyOverviewResponse } from '../schema/currency-overview';

export enum CurrencyOverviewType {
    Currency = 'Currency',
    Fragment = 'Fragment'
}

const PATH_TYPE_MAP = {
    [CurrencyOverviewType.Currency]: 'currency',
    [CurrencyOverviewType.Fragment]: 'fragments',
};

const RETRY_COUNT = 3;
const RETRY_DELAY = 100;

@Injectable({
    providedIn: 'root'
})
export class CurrencyOverviewHttpService {
    private readonly apiUrl: string;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly browser: BrowserService,
        private readonly session: SessionService,
        private readonly logger: LoggerService) {
        this.apiUrl = `${environment.poeNinja.baseUrl}/api/data/currencyoverview`;
    }

    public get(leagueId: string, type: CurrencyOverviewType): Observable<CurrencyOverviewResponse> {
        const params = new HttpParams({
            fromObject: {
                league: leagueId,
                type,
                language: 'en'
            }
        });
        return this.httpClient.get<CurrencyOverviewResponse>(this.apiUrl, {
            params
        }).pipe(
            retryWhen(errors => errors.pipe(
                flatMap((response, count) => this.handleError(this.apiUrl, response, count))
            )),
            flatMap(response => {
                if (!response.lines) {
                    this.logger.warn(`Got empty result from ${this.apiUrl} with ${leagueId} and ${type}.`, response);
                    return throwError(`Got empty result from ${this.apiUrl} with ${leagueId} and ${type}.`)
                }

                const result: CurrencyOverviewResponse = {
                    ...response,
                    url: `${environment.poeNinja.baseUrl}/challenge/${PATH_TYPE_MAP[type]}`
                }
                return of(result);
            })
        );
    }

    private handleError(url: string, response: HttpErrorResponse, count: number): Observable<void> {
        if (count >= RETRY_COUNT) {
            return throwError(response);
        }

        switch (response.status) {
            case 403:
                return this.browser.retrieve(url);
            default:
                return this.session.clear().pipe(delay(RETRY_DELAY));
        }
    }
}
