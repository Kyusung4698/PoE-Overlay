import { NgModule } from '@angular/core';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { SharedModule } from '@shared/shared.module';
import { MiscSettingsComponent } from './component';
import { MiscFeatureSettings } from './misc-feature-settings';
import { MiscStashService } from './service/misc-stash.service';


@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MiscModule, multi: true }],
    declarations: [
        MiscSettingsComponent
    ],
    imports: [SharedModule]
})
export class MiscModule implements FeatureModule<MiscFeatureSettings> {
    constructor(private readonly miscStash: MiscStashService) { }

    public getConfig(): FeatureConfig<MiscFeatureSettings> {
        const config: FeatureConfig<MiscFeatureSettings> = {
            name: 'misc.name',
            component: MiscSettingsComponent,
            default: {}
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.MiscStasHighlight }
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey): void {
        switch (hotkey) {
            case Hotkey.MiscStasHighlight:
                this.miscStash.highlight().subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }
}
