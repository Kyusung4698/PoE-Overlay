import { Injectable } from '@angular/core';
import { StorageService } from '@app/service';
import { UiLanguage } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { UserSettings } from '../type';

const USER_SETTINGS_KEY = 'USER_SETTINGS';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsStorageService {
    constructor(private readonly storage: StorageService) { }

    public get(): Observable<UserSettings> {
        return this.storage.get<UserSettings>(USER_SETTINGS_KEY, {
            language: Language.English,
            uiLanguage: UiLanguage.English
        });
    }

    public save(value: UserSettings): Observable<UserSettings> {
        return this.storage.save(USER_SETTINGS_KEY, value);
    }
}
