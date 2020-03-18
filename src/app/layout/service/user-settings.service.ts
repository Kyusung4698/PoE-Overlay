import { Injectable } from '@angular/core';
import { FeatureModule, UiLanguage } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { DialogSpawnPosition, UserSettings } from '../type';
import { UserSettingsDialogService } from './user-settings-dialog.service';
import { UserSettingsFeatureService } from './user-settings-feature.service';
import { UserSettingsStorageService } from './user-settings-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    constructor(
        private readonly userSettingsStorageService: UserSettingsStorageService,
        private readonly userSettingsFeatureService: UserSettingsFeatureService,
        private readonly userSettingsDialogService: UserSettingsDialogService) { }

    public get(): Observable<UserSettings> {
        return this.userSettingsStorageService.get();
    }

    public init(modules: FeatureModule[]): Observable<UserSettings> {
        return this.userSettingsStorageService.get().pipe(
            flatMap(savedSettings => {
                let mergedSettings: UserSettings = {
                    openUserSettingsKeybinding: 'F7',
                    exitAppKeybinding: 'F8',
                    language: Language.English,
                    uiLanguage: UiLanguage.English,
                    zoom: 100,
                    dialogSpawnPosition: DialogSpawnPosition.Center,
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

    public edit(settings: UserSettings): Observable<UserSettings> {
        const features = this.userSettingsFeatureService.get();
        return this.userSettingsDialogService.open(settings, features).pipe(
            flatMap(result => result ? this.userSettingsStorageService.save(result) : of(null))
        );
    }

    public update(updateFn: (settings: UserSettings) => UserSettings): Observable<UserSettings> {
        return this.userSettingsStorageService.get().pipe(
            map(settings => updateFn(settings)),
            flatMap(settings => this.userSettingsStorageService.save(settings))
        );
    }
}
