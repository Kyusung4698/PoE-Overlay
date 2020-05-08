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

const RULE_FRESH_DURATION = 1000 * 10;

const WAITING_RETRY_DELAY = 1000;
const WAITING_RETRY_COUNT = 10;

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
    update: number;
}

enum TradeRateThrottle {
    None = 1,
    Stale = 2,
    Reached = 3,
    Limited = 4
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
                const reason = this.shouldThrottle(resource);
                switch (reason) {
                    case TradeRateThrottle.Limited:
                        return throwError('limited');
                    case TradeRateThrottle.Reached:
                    case TradeRateThrottle.Stale:
                        return throwError('waiting');
                    default:
                        const request = this.createRequest(resource);
                        return getRequest().pipe(
                            map(response => {
                                request.finished = Date.now();
                                this.updateRules(resource, response);
                                this.filterRequests(resource);
                                return response.body
                            }),
                            catchError(response => {
                                request.finished = Date.now();
                                if (response.status === 429) {
                                    this.updateRules(resource, response);
                                }
                                this.filterRequests(resource);
                                return throwError(response);
                            })
                        );
                }
            }),
            retryWhen(errors => errors.pipe(
                flatMap((error, count) => {
                    if (error === 'limited') {
                        return throwError({
                            status: 429
                        });
                    } else if (error === 'waiting') {
                        if (count >= WAITING_RETRY_COUNT) {
                            return throwError({
                                status: 429
                            });
                        }
                        return of(error).pipe(delay(WAITING_RETRY_DELAY));
                    }
                    return throwError(error);
                })
            ))
        );
    }

    private shouldThrottle(resource: string): TradeRateThrottle {
        const { rules, requests, update } = this.getLimit(resource);

        const inflight = requests.some(request => !request.finished);
        if (!inflight) {
            return TradeRateThrottle.None;
        }

        // only allow 1 request until
        // > rules are filled
        // > rules are fresh again
        const now = Date.now();
        if (!rules || (now - update) > RULE_FRESH_DURATION) {
            return TradeRateThrottle.Stale;
        }

        // only allow a new request if no rule is limited
        const limited = rules.some(rule => rule.limited && rule.limited > now);
        if (limited) {
            return TradeRateThrottle.Limited;
        }

        const reached = rules.some(rule => {
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
        if (reached) {
            return TradeRateThrottle.Reached;
        }
        return TradeRateThrottle.None;
    }

    private createRequest(resource: string): TradeRateLimitRequest {
        const limit = this.getLimit(resource);
        const request: TradeRateLimitRequest = {};
        limit.requests.push(request);
        return request;
    }

    private filterRequests(resource: string): void {
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
        const current = this.getLimit(resource);

        const rules = response?.headers?.get(HEADER_RULES);
        if (!rules) {
            current.rules = undefined;
            return;
        }

        const now = Date.now();

        current.update = now;
        current.rules = rules.toLowerCase()
            .split(HEADER_RULE_SEPARATOR)
            .map(name => name.trim())
            .map(name => {
                const limits = response.headers.get(`${HEADER_RULE}-${name}`).split(HEADER_RULE_SEPARATOR);
                const states = response.headers.get(`${HEADER_RULE}-${name}-${HEADER_RULE_STATE}`).split(HEADER_RULE_SEPARATOR);
                if (limits.length !== states.length) {
                    return undefined;
                }

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
                            ? now + limited * 1000
                            : undefined
                    };

                    if (!rule.limited) {
                        const limit = now - rule.period * 1000;
                        const limiting = current.requests.filter(request => {
                            if (!request.finished) {
                                return true;
                            }
                            return request.finished >= limit;
                        });

                        let missing = currentCount - limiting.length;
                        while (missing > 0) {
                            current.requests.push({
                                finished: now,
                            });
                            --missing;
                        }
                    }
                    return rule;
                });
            })
            .reduce((a, b) => a.concat(b), [])
            .filter(rule => rule !== undefined);
    }

    private getLimit(resource: string): TradeRateLimit {
        if (!this.limits[resource]) {
            this.limits[resource] = {
                requests: [],
                rules: undefined,
                update: undefined
            };
        }
        return this.limits[resource];
    }
}