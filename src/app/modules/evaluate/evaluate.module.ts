import { NgModule } from '@angular/core';
import { Hotkey } from '@app/config/hotkey';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { Language } from '@data/poe/schema';
import { TradeSearchIndexed } from '@shared/module/poe/trade';
import { SharedModule } from '@shared/shared.module';
import { EvaluateItemFrameComponent, EvaluateItemPriceComponent, EvaluateItemPricePredictionComponent, EvaluateItemPriceRateComponent, EvaluateItemPriceRateFactorsComponent, EvaluateItemPriceRateGraphComponent, EvaluateItemPriceRateValuesComponent, EvaluateItemSearchComponent, EvaluateItemSearchGraphComponent, EvaluateItemSearchHeaderComponent, EvaluateItemSearchTableComponent, EvaluateItemSearchValuesComponent, EvaluateSettingsComponent } from './component';
import { EvaluateItemOptionsComponent } from './component/evaluate-item-options/evaluate-item-options.component';
import { EvaluateFeatureSettings, EvaluateItemSearchLayout } from './evaluate-feature-settings';
import { EvaluateService } from './service';
import { EvaluateWindowComponent } from './window';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [
        // window
        EvaluateWindowComponent,
        // settings
        EvaluateSettingsComponent,
        // item
        EvaluateItemFrameComponent,
        EvaluateItemSearchComponent,
        EvaluateItemSearchValuesComponent,
        EvaluateItemSearchHeaderComponent,
        EvaluateItemSearchGraphComponent,
        EvaluateItemSearchTableComponent,
        // price
        EvaluateItemPriceComponent,
        EvaluateItemPriceRateComponent,
        EvaluateItemPriceRateGraphComponent,
        EvaluateItemPricePredictionComponent,
        EvaluateItemPriceRateFactorsComponent,
        EvaluateItemPriceRateValuesComponent,
        EvaluateItemOptionsComponent
    ],
    exports: [EvaluateWindowComponent],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule<EvaluateFeatureSettings> {

    constructor(private readonly evaluateService: EvaluateService) { }

    public getConfig(): FeatureConfig<EvaluateFeatureSettings> {
        const config: FeatureConfig<EvaluateFeatureSettings> = {
            name: 'evaluate.name',
            component: EvaluateSettingsComponent,
            default: {
                evaluateCurrencies: ['chaos', 'exa'],
                evaluateCurrenciesOriginal: true,
                evaluateTranslateLanguage: Language.English,
                evaluateItemSearchLayout: EvaluateItemSearchLayout.Graph,
                evaluateItemSearchHorizontal: false,
                evaluateItemSearchQueryInitial: false,
                evaluateItemSearchQueryDebounceTime: 10,
                evaluateItemSearchQueryFetchCount: 30,
                evaluateItemSearchFilterOnlineOnly: true,
                evaluateItemSearchFilterIndexed: TradeSearchIndexed.UpTo3DaysAgo,
                evaluateItemSearchPropertyMinRange: 10,
                evaluateItemSearchPropertyMaxRange: 50,
                evaluateItemSearchPropertyAttack: true,
                evaluateItemSearchPropertyDefense: true,
                evaluateItemSearchPropertyNormalizeQuality: true,
                evaluateItemSearchPropertyItemLevel: true,
                evaluateItemSearchPropertyItemType: false,
                evaluateItemSearchPropertyMiscs: true,
                evaluateItemSearchPropertyLinks: 5,
                evaluateItemSearchStatMinRange: 10,
                evaluateItemSearchStatMaxRange: 50,
                evaluateItemSearchStatUniqueAll: true,
                evaluateItemSearchStats: {
                    'pseudo.pseudo_total_elemental_resistance': true,
                    'pseudo.pseudo_total_resistance': true,
                    'pseudo.pseudo_total_strength': true,
                    'pseudo.pseudo_total_life': true,
                    'pseudo.pseudo_total_energy_shield': true,
                    'pseudo.pseudo_increased_energy_shield': true,
                    'pseduo.pseudo_increased_movement_speed': true,
                    'explicit.stat_1479533453': true,
                    'enchant.stat_290368246': true,
                    'implicit.stat_299373046': true,
                },
            },
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.Evaluate },
            { hotkey: Hotkey.EvaluateTranslate }
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey, settings: EvaluateFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.Evaluate:
                this.evaluateService.evaluate(settings).subscribe();
                break;
            case Hotkey.EvaluateTranslate:
                const { evaluateTranslateLanguage } = settings;
                this.evaluateService.evaluate(settings, evaluateTranslateLanguage).subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }
}
