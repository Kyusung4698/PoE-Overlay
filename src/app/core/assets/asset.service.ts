import { Injectable } from '@angular/core';
import { ProcessStorageService } from '@app/storage';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Asset } from './asset';

const ASSETS_KEY = 'ASSETS';

@Injectable({
    providedIn: 'root'
})
export class AssetService {
    private readonly assets: {
        [key: string]: any
    };

    constructor(private readonly storageService: ProcessStorageService) {
        this.assets = this.storageService.get(ASSETS_KEY, () => ({}));
    }

    public get(key: Asset): any {
        return this.assets[key];
    }

    public load(): Observable<boolean> {
        const tasks = [
            this.import(Asset.ClientStrings, 'client-strings.json'),
            this.import(Asset.BaseItemTypeCategories, 'base-item-type-categories.json'),
            this.import(Asset.BaseItemTypes, 'base-item-types.json'),
            this.import(Asset.Stats, 'stats.json'),
            this.import(Asset.StatsLocal, 'stats-local.json'),
            this.import(Asset.Words, 'words.json'),
            this.import(Asset.Maps, 'maps.json'),
            this.import(Asset.TradeRegex, 'trade-regex.json'),
        ];
        return forkJoin(tasks).pipe(
            map(() => true)
        );
    }

    private import(key: Asset, name: string): Observable<boolean> {
        if (!this.get(key)) {
            const promise = import(`./../../../assets/poe/data/${name}`);
            return from(promise).pipe(
                tap(data => this.assets[key] = data.default),
                map(() => true)
            );
        }
        return of(true);
    }
}
