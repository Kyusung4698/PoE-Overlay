import { UserSettings, UserSettingsFeature } from 'src/app/layout/type';

export interface Feature {
    name: string;
    accelerator: string;
    passive?: boolean;
}

export interface FeatureModule {
    getSettings(): UserSettingsFeature;
    getFeatures(settings: UserSettings): Feature[];
    run(feature: string, settings: UserSettings): void;
}
