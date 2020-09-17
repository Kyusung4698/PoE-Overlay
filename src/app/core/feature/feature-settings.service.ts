import { Injectable } from '@angular/core';
import { UiLanguage } from '@app/config';
import { EventEmitter } from '@app/event';
import { Language } from '@data/poe/schema';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { FeatureModule } from './feature-module';
import { FeatureSettings } from './feature-settings';
import { FeatureSettingsStorageService } from './feature-settings-storage.service';

const DEFAULT_SETTINGS: FeatureSettings = {
    language: Language.English,
    uiLanguage: UiLanguage.English,
    dialogOpacity: 0.9,
};

@Injectable({
    providedIn: 'root'
})
export class FeatureSettingsService {
    constructor(private readonly featureSettingsStorageService: FeatureSettingsStorageService) { }

    public get(): Observable<FeatureSettings> {
        return this.featureSettingsStorageService.get();
    }

    public change(): EventEmitter<FeatureSettings> {
        return this.featureSettingsStorageService.change();
    }

    public put(settings: FeatureSettings): Observable<FeatureSettings> {
        return this.featureSettingsStorageService.put(settings);
    }

    public update(updateFn: (settings: FeatureSettings) => void): Observable<FeatureSettings> {
        return this.get().pipe(
            tap(settings => updateFn(settings)),
            mergeMap(settings => this.put(settings))
        );
    }

    public init(modules: FeatureModule<FeatureSettings>[]): Observable<FeatureSettings> {
        return this.get().pipe(
            mergeMap(settings => {
                let merged: FeatureSettings = {
                    ...DEFAULT_SETTINGS
                };
                modules.forEach(module => {
                    const config = module.getConfig();
                    const defaultSettings = config.default;
                    merged = {
                        ...merged,
                        ...defaultSettings
                    };
                });
                merged = {
                    ...merged,
                    ...settings
                };
                return this.put(merged);
            })
        );
    }
}
