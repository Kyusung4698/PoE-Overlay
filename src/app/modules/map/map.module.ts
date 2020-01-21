import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { MapDialogComponent } from './component/map-dialog/map-dialog.component';
import { MapSettingsComponent, MapUserSettings } from './component/map-settings/map-settings.component';
import { MapService } from './service/map.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MapModule, multi: true }],
    declarations: [MapDialogComponent, MapSettingsComponent],
    entryComponents: [MapDialogComponent, MapSettingsComponent],
    imports: [SharedModule]
})
export class MapModule implements FeatureModule {

    constructor(private readonly mapService: MapService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: MapUserSettings = {
            mapInfoKeybinding: 'Alt + Q',
        };
        return {
            name: 'Map',
            component: MapSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: MapUserSettings): Feature[] {
        const features: Feature[] = [
            {
                name: 'info',
                shortcut: settings.mapInfoKeybinding
            },
        ];
        return features;
    }

    public run(feature: string, _: MapUserSettings): void {
        switch (feature) {
            case 'info':
                this.mapService.info().subscribe();
                break;
            default:
                break;
        }
    }
}
