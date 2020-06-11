import { Type } from '@angular/core';
import { FeatureSettings } from './feature-settings';
import { FeatureSettingsComponent } from './feature-settings.component';

export interface FeatureConfig<TSettings extends FeatureSettings> {
    name: string;
    default: TSettings;
    component: Type<FeatureSettingsComponent<TSettings>>;
}
