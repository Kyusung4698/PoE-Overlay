import { Injectable } from '@angular/core';
import { EventEmitter } from '@app/event';
import { ProcessStorageService, StorageService } from '@app/storage';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FeatureSettings } from './feature-settings';

const USER_SETTINGS_KEY = 'USER_SETTINGS';

@Injectable({
    providedIn: 'root'
})
export class FeatureSettingsStorageService {
    public get settings$(): EventEmitter<FeatureSettings> {
        return this.processStorage.get(USER_SETTINGS_KEY, () => new EventEmitter<FeatureSettings>());
    }

    constructor(
        private readonly storage: StorageService,
        private readonly processStorage: ProcessStorageService) { }

    public get(): Observable<FeatureSettings> {
        const settings = this.settings$.get();
        if (settings) {
            return of(settings);
        }
        return this.storage.get<FeatureSettings>(USER_SETTINGS_KEY);
    }

    public change(): EventEmitter<FeatureSettings> {
        return this.settings$;
    }

    public put(value: FeatureSettings): Observable<FeatureSettings> {
        return this.storage.put(USER_SETTINGS_KEY, value).pipe(
            tap(() => this.settings$.next(value))
        );
    }
}
