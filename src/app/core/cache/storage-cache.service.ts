import { Injectable } from '@angular/core';
import { ProcessStorageService, StorageService } from '@app/storage';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

interface CacheEntry<TValue> {
    value: TValue;
    expiry: number;
}

const STORAGE_CACHE_KEY = 'STORAGE_CACHE';

@Injectable({
    providedIn: 'root'
})
export class StorageCacheService {
    private readonly cache: {
        [key: string]: Observable<any>
    } = {};
    private readonly values: {
        [key: string]: CacheEntry<any>
    };

    constructor(
        private readonly storage: StorageService,
        processStorage: ProcessStorageService) {
        this.values = processStorage.get(STORAGE_CACHE_KEY, () => ({}));
    }

    public proxy<TValue>(
        key: string,
        valueFn: () => Observable<TValue>,
        expiry: number
    ): Observable<TValue> {
        return this.get(key).pipe(
            mergeMap(entry => {
                const now = Date.now();
                if (entry && entry.expiry > now) {
                    return of(entry.value);
                }
                if (!this.cache[key]) {
                    this.cache[key] = valueFn().pipe(
                        catchError(error => {
                            if (entry) {
                                console.warn(
                                    `Could not update value for key: '${key}'. ` +
                                    `Using cached value from: '${new Date(entry.expiry).toISOString()}'.`, error);
                                return of(entry.value);
                            }
                            return throwError(error);
                        }),
                        tap(value => {
                            this.cache[key] = undefined;
                            this.store(key, value, expiry);
                        }),
                        shareReplay(1)
                    );
                }
                return this.cache[key];
            })
        );
    }

    public store<TValue>(key: string, value: TValue, expiry: number): TValue {
        const now = Date.now();
        const entry: CacheEntry<TValue> = {
            value,
            expiry: now + expiry
        };
        this.values[key] = entry;
        this.storage.put(key, entry);
        return value;
    }

    public retrieve<TValue>(key: string): Observable<TValue> {
        return this.get<TValue>(key).pipe(
            map(entry => entry?.value)
        );
    }

    public clear(path: string): Observable<void> {
        const now = Date.now();
        return this.storage.delete<CacheEntry<any>>((key, value) => {
            const markAsDeleted = key.startsWith(path) && value && value.expiry <= now;
            if (markAsDeleted) {
                delete this.values[key];
            }
            return markAsDeleted;
        });
    }

    private get<TValue>(key: string): Observable<CacheEntry<TValue>> {
        if (this.values[key]) {
            return of(this.values[key]);
        }
        return this.storage.get(key);
    }
}
