import { Injectable } from '@angular/core';
import { FeatureModule } from '@app/type';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserSettingsDialogData } from '../component';
import { UserSettings } from '../type';
import { UserSettingsDialogService } from './user-settings-dialog.service';
import { UserSettingsFeatureService } from './user-settings-feature.service';
import { UserSettingsStorageService } from './user-settings-storage.service';
import { Language } from '@shared/module/poe/type';

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
                    displayVersion: true
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
}
