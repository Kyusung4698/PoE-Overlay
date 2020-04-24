import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { StorageService } from './storage.service';

interface CacheEntry<TValue> {
    value: TValue;
    expiry: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private readonly cache: {
        [key: string]: Observable<any>
    } = {};

    constructor(
        private readonly storage: StorageService,
        private readonly logger: LoggerService) { }

    public proxy<TValue>(
        key: string, valueFn: () => Observable<TValue>,
        expiry: number,
        slidingExpiry: boolean = false): Observable<TValue> {
        return this.storage.get<CacheEntry<TValue>>(key).pipe(flatMap(entry => {
            const now = Date.now();
            if (entry && entry.expiry > now) {
                if (slidingExpiry) {
                    this.storage.save(key, {
                        value: entry.value,
                        expiry: now + expiry
                    })
                }
                return of(entry.value);
            }
            if (!this.cache[key]) {
                this.cache[key] = valueFn().pipe(
                    catchError(error => {
                        if (entry) {
                            this.logger.info(
                                `Could not update value for key: '${key}'. Using cached value from: '${new Date(entry.expiry).toISOString()}'.`,
                                error);
                            return of(entry.value);
                        }
                        return throwError(error);
                    }),
                    tap(value => {
                        this.cache[key] = undefined;
                        this.storage.save(key, {
                            value,
                            expiry: now + expiry
                        })
                    }),
                    shareReplay(1)
                );
            }
            return this.cache[key];
        }));
    }

    public store<TValue>(key: string, value: TValue, expiry: number, waitForResult: boolean = true): Observable<TValue> {
        const now = Date.now();
        const result = this.storage.save(key, {
            value,
            expiry: now + expiry
        });
        if (waitForResult) {
            return result.pipe(map(() => value));
        }
        return of(value);
    }

    public retrieve<TValue>(key: string): Observable<TValue> {
        return this.storage.get<CacheEntry<TValue>>(key).pipe(
            map(entry => entry?.value)
        );
    }

    public clear(path: string): Observable<void> {
        const now = Date.now();
        return this.storage.delete<CacheEntry<any>>((key, value) => {
            return key.startsWith(path) && value && value.expiry <= now;
        });
    }

    public keys(): Observable<string[]> {
        return this.storage.keys();
    }
}