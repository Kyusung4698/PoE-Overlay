import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, flatMap, map, retryWhen } from 'rxjs/operators';

// 1 request
// x-rate-limit-ip: 12:4:10,16:12:300
// x-rate-limit-ip-state: 1:4:0,1:12:0
// x-rate-limit-policy: trade-fetch-request-limit
// x-rate-limit-rules: Ip

// 2 request
// x-rate-limit-ip: 12:4:10,16:12:300
// x-rate-limit-ip-state: 2:4:0,2:12:0
// x-rate-limit-policy: trade-fetch-request-limit
// x-rate-limit-rules: Ip

// 3 request
// x-rate-limit-ip: 12:4:10,16:12:300
// x-rate-limit-ip-state: 3:4:0,3:12:0
// x-rate-limit-policy: trade-fetch-request-limit
// x-rate-limit-rules: Ip

// reached
// x-rate-limit-ip: 12:4:10,16:12:300
// x-rate-limit-ip-state: 7:4:0,17:12:0
// x-rate-limit-policy: trade-fetch-request-limit
// x-rate-limit-rules: Ip

// after reached
// x-rate-limit-ip: 12:4:10,16:12:300
// x-rate-limit-ip-state: 4:4:0,4:12:218
// x-rate-limit-policy: trade-fetch-request-limit
// x-rate-limit-rules: Ip

const HEADER_RULE = `x-rate-limit`
const HEADER_RULE_SEPARATOR = `,`
const HEADER_RULE_VALUE_SEPARATOR = `:`
const HEADER_RULE_STATE = `state`
const HEADER_RULES = `x-rate-limit-rules`;
const THROTTLE_RETRY_DELAY = 1000;

interface TradeRateLimitRule {
    count: number;
    period: number;
    limited: number;
}

interface TradeRateLimitRequest {
    finished?: number;
}

interface TradeRateLimit {
    requests: TradeRateLimitRequest[];
    rules: TradeRateLimitRule[];
}

@Injectable({
    providedIn: 'root'
})
export class TradeRateLimitService {
    private readonly limits: {
        [resource: string]: TradeRateLimit
    } = {};

    public throttle<TResult>(resource: string, getRequest: () => Observable<HttpResponse<TResult>>): Observable<TResult> {
        return of(null).pipe(
            flatMap(() => {
                if (this.shouldThrottle(resource)) {
                    return throwError('throttle');
                }
                const request = this.createRequest(resource);
                return getRequest().pipe(
                    map(response => {
                        request.finished = Date.now();
                        this.updateRules(resource, response);
                        this.updateRequests(resource);
                        return response.body
                    }),
                    catchError(response => {
                        request.finished = Date.now();
                        if (response.status === 429) {
                            this.updateRules(resource, response);
                        }
                        this.updateRequests(resource);
                        return throwError(response);
                    })
                );
            }),
            retryWhen(errors => errors.pipe(
                flatMap(error => {
                    if (error === 'throttle') {
                        return of(error).pipe(delay(THROTTLE_RETRY_DELAY));
                    }
                    return throwError(error);
                })
            ))
        );
    }

    private shouldThrottle(resource: string): boolean {
        const { rules, requests } = this.getLimit(resource);
        if (!rules) {
            // only allow 1 request until rules are filled
            return requests.some(request => !request.finished);
        }

        const now = Date.now();
        return rules.some(rule => {
            // throttle while limited is greater than now
            if (rule.limited && rule.limited > now) {
                return true;
            }

            // all requests which were made in the period count
            const limit = now - rule.period * 1000;
            const limiting = requests.filter(request => {
                if (!request.finished) {
                    return true;
                }
                return request.finished >= limit;
            });
            return limiting.length >= rule.count;
        });
    }

    private createRequest(resource: string): TradeRateLimitRequest {
        const limit = this.getLimit(resource);
        const request: TradeRateLimitRequest = {};
        limit.requests.push(request);
        return request;
    }

    private updateRequests(resource: string): void {
        const limit = this.getLimit(resource);
        const now = Date.now();
        limit.requests = limit.requests.filter(request => {
            if (!request.finished) {
                return true;
            }
            return limit.rules.some(rule => {
                const min = now - rule.period * 1000;
                return request.finished >= min;
            });
        })
    }

    private updateRules(resource: string, response: HttpResponse<any>): void {
        const limit = this.getLimit(resource);
        const rules = response?.headers?.get(HEADER_RULES);
        if (rules) {
            limit.rules = rules.toLowerCase()
                .split(HEADER_RULE_SEPARATOR)
                .map(name => name.trim())
                .map(name => {
                    const limits = response.headers.get(`${HEADER_RULE}-${name}`).split(HEADER_RULE_SEPARATOR);
                    const states = response.headers.get(`${HEADER_RULE}-${name}-${HEADER_RULE_STATE}`).split(HEADER_RULE_SEPARATOR);
                    if (limits.length === states.length) {
                        return limits.map((_, index) => {
                            const [count, period, timeoff] = limits[index].split(HEADER_RULE_VALUE_SEPARATOR).map(x => +x);
                            const [currentCount, , currentTimeoff] = states[index].split(HEADER_RULE_VALUE_SEPARATOR).map(x => +x);
                            let limited = currentTimeoff;
                            if (limited <= 0 && currentCount > count) {
                                limited = timeoff;
                            }
                            const rule: TradeRateLimitRule = {
                                count, period,
                                limited: limited > 0
                                    ? Date.now() + limited * 1000
                                    : undefined
                            };
                            return rule;
                        });
                    } else {
                        return undefined;
                    }
                })
                .reduce((a, b) => a.concat(b), [])
                .filter(rule => rule !== undefined);
        } else {
            limit.rules = undefined;
        }
    }

    private getLimit(resource: string): TradeRateLimit {
        if (!this.limits[resource]) {
            this.limits[resource] = {
                requests: [],
                rules: undefined
            };
        }
        return this.limits[resource];
    }
}