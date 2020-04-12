import { Injectable } from '@angular/core';
import { FeatureModule, UiLanguage } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { DialogSpawnPosition, UserSettings, UserSettingsFeature } from '../type';
import { UserSettingsFeatureService } from './user-settings-feature.service';
import { UserSettingsStorageService } from './user-settings-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    constructor(
        private readonly userSettingsStorageService: UserSettingsStorageService,
        private readonly userSettingsFeatureService: UserSettingsFeatureService) { }

    public get(): Observable<UserSettings> {
        const settings = this.userSettingsStorageService.get();
        return settings;
    }

    public save(settings: UserSettings): Observable<UserSettings> {
        return this.userSettingsStorageService.save(settings);
    }

    public features(): UserSettingsFeature[] {
        const features = this.userSettingsFeatureService.get();
        return features;
    }

    public init(modules: FeatureModule[]): Observable<UserSettings> {
        return this.get().pipe(
            flatMap(savedSettings => {
                let mergedSettings: UserSettings = {
                    openUserSettingsKeybinding: 'F7',
                    exitAppKeybinding: 'F8',
                    language: Language.English,
                    uiLanguage: UiLanguage.English,
                    zoom: 100,
                    dialogSpawnPosition: DialogSpawnPosition.Center,
                    dialogOpacity: 0.8,
                    displayVersion: true,
                    autoDownload: true
                };

                modules.forEach(x => {
                    const featureSettings = x.getSettings();
                    mergedSettings = {
                        ...mergedSettings,
                        ...featureSettings.defaultSettings
                    };
                    this.userSettingsFeatureService.register(featureSettings);
                });

                mergedSettings = {
                    ...mergedSettings,
                    ...savedSettings
                };

                return this.userSettingsStorageService.save(mergedSettings);
            })
        );
    }

    public update(updateFn: (settings: UserSettings) => UserSettings): Observable<UserSettings> {
        return this.userSettingsStorageService.get().pipe(
            map(settings => updateFn(settings)),
            flatMap(settings => this.userSettingsStorageService.save(settings))
        );
    }
}
