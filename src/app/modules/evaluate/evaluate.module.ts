import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { EvaluateAreaChartComponent } from './component/evaluate-area-chart/evaluate-area-chart.component';
import { EvaluateChartComponent } from './component/evaluate-chart/evaluate-chart.component';
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateSearchComponent } from './component/evaluate-search/evaluate-search.component';
import { EvaluateSettingsComponent, EvaluateUserSettings } from './component/evaluate-settings/evaluate-settings.component';
import { EvaluateComponent } from './component/evaluate/evaluate.component';
import { EvaluateService } from './service/evaluate.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [
        EvaluateDialogComponent,
        EvaluateSettingsComponent,
        EvaluateChartComponent,
        EvaluateAreaChartComponent,
        EvaluateComponent,
        EvaluateSearchComponent
    ],
    entryComponents: [EvaluateDialogComponent, EvaluateSettingsComponent],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule {

    constructor(private readonly evaluateService: EvaluateService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: EvaluateUserSettings = {
            evaluateCurrencyIds: ['chaos', 'exa'],
            evaluateQueryDefaultItemLevel: false,
            evaluateQueryDefaultSockets: false,
            evaluateQueryDefaultMiscs: true,
            evaluateQueryDefaultType: true,
            evaluateQueryDefaultStats: {
                'pseudo.pseudo_total_elemental_resistance': true,
                'pseudo.pseudo_total_resistance': true,
                'pseudo.pseudo_total_strength': true,
                'pseudo.pseudo_total_life': true,
                'pseudo.pseudo_total_energy_shield': true,
                'explicit.stat_1479533453': true,
                'enchant.stat_290368246': true
            },
            evaluateQueryIndexedRange: ItemSearchIndexed.UpTo3DaysAgo,
            evaluateQueryOnline: true,
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
