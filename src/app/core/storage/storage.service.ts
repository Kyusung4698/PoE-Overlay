import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly db: LocalForage;

    constructor() {
        this.db = localForage;
    }

    public get<TData>(key: string): Observable<TData> {
        const promise = this.db.getItem<TData>(key);
        return from(promise);
    }

    public put<TData>(key: string, value: TData): Observable<TData> {
        const promise = this.db.setItem<TData>(key, value);
        return from(promise);
    }

    public delete<TValue>(predicate: (key: string, value: TValue) => boolean): Observable<void> {
        const toDelete = [];

        const iteratePromise = this.db.iterate((value: TValue, key) => {
            if (predicate(key, value)) {
                toDelete.push(key);
            }
        });

        return from(iteratePromise).pipe(
            mergeMap(() => {
                if (toDelete.length === 0) {
                    return of(null);
                }
                const tasks = toDelete.map(key => {
                    const removePromise = this.db.removeItem(key);
                    return from(removePromise);
                });
                return forkJoin(tasks).pipe(
                    map(() => null)
                );
            })
        );
    }
}
