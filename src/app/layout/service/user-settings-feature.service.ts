import { Injectable } from '@angular/core';
import { UserSettingsFeature } from '../type';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsFeatureService {
    private readonly feature: UserSettingsFeature[] = [];

    public get(): UserSettingsFeature[] {
        return [...this.feature];
    }

    public register(feature: UserSettingsFeature): void {
        this.feature.push(feature);
    }
}
