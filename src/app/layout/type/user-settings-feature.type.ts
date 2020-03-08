import { Type } from '@angular/core';
import { UserSettings } from './user-settings.type';

export interface UserSettingsComponent {
    settings: UserSettings;
    load(): void;
}

export interface UserSettingsFeature {
    name: string;
    component: Type<UserSettingsComponent>;
    defaultSettings: UserSettings;
}
