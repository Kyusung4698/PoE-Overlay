import { Input } from '@angular/core';
import { FeatureSettings } from './feature-settings';

export abstract class FeatureSettingsComponent<TSettings extends FeatureSettings> {
    @Input()
    public settings: TSettings;

    public abstract load(): void;
    public save(): void { }
}
