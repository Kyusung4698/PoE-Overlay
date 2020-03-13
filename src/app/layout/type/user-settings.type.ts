import { Language } from '@shared/module/poe/type';

export enum DialogSpawnPosition {
    Cursor = 1,
    Center = 2
}

export interface UserSettings {
    leagueId?: string;
    language?: Language;
    openUserSettingsKeybinding?: string;
    exitAppKeybinding?: string;
    zoom?: number;
    dialogSpawnPosition?: DialogSpawnPosition;
    displayVersion?: boolean;
    autoDownload?: boolean;
}
