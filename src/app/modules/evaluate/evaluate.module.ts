import { NgModule, Injectable } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { Language } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { EvaluateExchangeRateChartComponent } from './component/evaluate-exchange-rate-chart/evaluate-exchange-rate-chart.component';
import { EvaluateSearchChartComponent } from './component/evaluate-search-chart/evaluate-search-chart.component';
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateSearchComponent } from './component/evaluate-search/evaluate-search.component';
import { EvaluateSettingsComponent, EvaluateUserSettings, EvaluateResultView } from './component/evaluate-settings/evaluate-settings.component';
import { EvaluateExchangeRateComponent } from './component/evaluate-exchange-rate/evaluate-exchange-rate.component';
import { EvaluateService } from './service/evaluate.service';
import { EvaluateSearchTableComponent } from './component/evaluate-search-table/evaluate-search-table.component';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [
        EvaluateDialogComponent,
        EvaluateSettingsComponent,
        EvaluateSearchChartComponent,
        EvaluateExchangeRateChartComponent,
        EvaluateExchangeRateComponent,
        EvaluateSearchComponent,
        EvaluateSearchTableComponent
    ],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule {

    constructor(private readonly evaluateService: EvaluateService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: EvaluateUserSettings = {
            evaluateCurrencyIds: ['chaos', 'exa'],
            evaluateResultView: EvaluateResultView.Graph,
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
            name: 'evaluate.name',
            component: EvaluateSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: EvaluateUserSettings): Feature[] {
        return [
            {
                name: 'evaluate',
                accelerator: settings.evaluateKeybinding
            },
            {
                name: 'evaluate-translate',
                accelerator: settings.evaluateTranslatedKeybinding
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
