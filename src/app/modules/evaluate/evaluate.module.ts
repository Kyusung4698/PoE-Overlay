import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateSettingsComponent, EvaluateUserSettings } from './component/evaluate-settings/evaluate-settings.component';
import { EvaluateService } from './service/evaluate.service';
import { Language } from '@shared/module/poe/type';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [EvaluateDialogComponent, EvaluateSettingsComponent],
    entryComponents: [EvaluateDialogComponent, EvaluateSettingsComponent],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule {

    constructor(private readonly evaluateService: EvaluateService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: EvaluateUserSettings = {
            currencyId: 'chaos',
            translatedItemLanguage: Language.English
        };
        return {
            name: 'Evaluate',
            component: EvaluateSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: EvaluateUserSettings): Feature[] {
        return [
            {
                name: 'evaluate',
                shortcut: 'CommandOrControl+D'
            },
            {
                name: 'evaluate-translate',
                shortcut: 'CommandOrControl+T'
            }
        ];
    }

    public run(feature: string, settings: EvaluateUserSettings): void {
        switch (feature) {
            case 'evaluate':
                this.evaluateService.evaluate(settings.currencyId).subscribe();
                break;
            case 'evaluate-translate':
                this.evaluateService.evaluate(settings.currencyId, settings.translatedItemLanguage).subscribe();
                break;
            default:
                break;
        }
    }
}
