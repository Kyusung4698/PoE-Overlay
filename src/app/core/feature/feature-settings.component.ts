import { Component, Input } from '@angular/core';
import { FeatureSettings } from './feature-settings';

@Component({
    template: ''
})
export abstract class FeatureSettingsComponent<TSettings extends FeatureSettings> {
    @Input()
    public settings: TSettings;

    public abstract load(): void;
    public save(): void { }
}
