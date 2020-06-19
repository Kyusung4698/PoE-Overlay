import { UiLanguage } from '@app/config';
import { Language } from '@data/poe/schema';

export interface FeatureSettings {
    language?: Language;
    leagueId?: string;
    uiLanguage?: UiLanguage;
    dialogOpacity?: number;
    characterName?: string;
}
