import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { ToolSettingsComponent, ToolUserSettings } from './component';
import { ToolService } from './service/tool.service';

@NgModule({
  providers: [{ provide: FEATURE_MODULES, useClass: ToolModule, multi: true }],
  declarations: [ToolSettingsComponent],
  entryComponents: [ToolSettingsComponent],
  imports: [SharedModule]
})
export class ToolModule implements FeatureModule {

    constructor(private readonly toolService: ToolService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: ToolUserSettings = {
            toolStorageLeft: 'CmdOrCtrl + MWHEELDOWN',
            toolStorageRight: 'CmdOrCtrl + MWHEELUP',
        };
        return {
            name: 'Tools',
            component: ToolSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: ToolUserSettings): Feature[] {
        return [
            {
                name: 'storage-left',
                shortcut: settings.toolStorageLeft
            },
            {
                name: 'storage-right',
                shortcut: settings.toolStorageRight
            }
        ];
    }

    public run(feature: string, settings: ToolUserSettings): void {
        this.toolService.command(feature);
    }
}
