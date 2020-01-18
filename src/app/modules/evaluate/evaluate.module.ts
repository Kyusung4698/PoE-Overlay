import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { EvaluateChartComponent } from './component/evaluate-chart/evaluate-chart.component';
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateSettingsComponent, EvaluateUserSettings } from './component/evaluate-settings/evaluate-settings.component';
import { EvaluateService } from './service/evaluate.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [EvaluateDialogComponent, EvaluateSettingsComponent, EvaluateChartComponent],
    entryComponents: [EvaluateDialogComponent, EvaluateSettingsComponent],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule {

    constructor(private readonly evaluateService: EvaluateService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: EvaluateUserSettings = {
            evaluateCurrencyIds: ['chaos', 'exa'],
            evaluateQueryDefault: true,
            evaluateQueryIndexed: ItemSearchIndexed.UpTo2WeeksAgo,
            evaluateQueryOnline: false,
            evaluateModifierRange: 10,
            evaluateModifierDisableMaxRange: true,
            evaluateKeybinding: 'CmdOrCtrl + D',
            evaluateTranslatedItemLanguage: Language.English,
            evaluateTranslatedKeybinding: 'CmdOrCtrl + T',
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
                shortcut: settings.evaluateKeybinding
            },
            {
                name: 'evaluate-translate',
                shortcut: settings.evaluateTranslatedKeybinding
            }
        ];
    }

    public run(feature: string, settings: EvaluateUserSettings): void {
        switch (feature) {
            case 'evaluate':
                this.evaluateService.evaluate(settings).subscribe();
                break;
            case 'evaluate-translate':
                this.evaluateService.evaluate(settings, settings.evaluateTranslatedItemLanguage).subscribe();
                break;
            default:
                break;
        }
    }
}
