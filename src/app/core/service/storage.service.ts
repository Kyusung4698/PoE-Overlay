import { Injectable } from '@angular/core';
import { LocalForageProvider } from '@app/provider';
import { from, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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
}
