import { Injectable } from '@angular/core';
import { LocalForageProvider } from '@app/provider';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly db: LocalForage;

    constructor(
        localForage: LocalForageProvider) {
        this.db = localForage.provide();
    }

    public get<TData>(key: string, value?: TData): Observable<TData> {
        return from(this.db.getItem<TData>(key)).pipe(
            flatMap(settings => settings
                ? of(settings)
                : this.save(key, value))
        );
    }

    public save<TData>(key: string, value: TData): Observable<TData> {
        return from(this.db.setItem<TData>(key, value));
    }

    public keys(): Observable<string[]> {
        return from(this.db.keys());
    }

    public delete<TValue>(predicate: (key: string, value: TValue) => boolean): Observable<void> {
        const toDelete = [];
        return from(this.db.iterate((value: TValue, key) => {
            if (predicate(key, value)) {
                toDelete.push(key);
            }
        })).pipe(
            flatMap(() => {
                const tasks = toDelete.map(key => from(this.db.removeItem(key)));
                if (tasks.length > 0) {
                    return forkJoin(tasks).pipe(map(() => null));
                }
                return of(null);
            })
        );
    }
}
