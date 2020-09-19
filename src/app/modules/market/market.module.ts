import { NgModule } from '@angular/core';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { SharedModule } from '@shared/shared.module';
import { MarketExchangeBarComponent, MarketExchangeComponent, MarketExchangeFilterComponent, MarketExchangeFilterItemComponent, MarketExchangePriceComponent, MarketFrameComponent, MarketInfiniteScrollComponent, MarketInputBooleanComponent, MarketInputComponent, MarketInputNumberComponent, MarketInputRangeComponent, MarketInputSelectComponent, MarketInputSelectOptionComponent, MarketItemSearchBarComponent, MarketItemSearchComponent, MarketItemSearchFilterComponent, MarketItemSearchFilterHeistComponent, MarketItemSearchFilterMiscComponent, MarketItemSearchFilterTradeComponent, MarketItemSearchFilterTypeComponent, MarketItemSearchResultComponent, MarketItemSearchStatComponent, MarketItemSearchStatGroupComponent, MarketItemSearchStatsComponent, MarketListingStatusComponent, MarketPanelComponent, MarketPanelGroupComponent, MarketSettingsComponent, MarketTabComponent, MarketTabGroupComponent } from './component';
import { MarketFeatureSettings } from './market-feature-settings';
import { MarketWindowService } from './service';
import { MarketWindowComponent } from './window';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MarketModule, multi: true }],
    declarations: [
        MarketSettingsComponent,
        MarketWindowComponent,
        MarketFrameComponent,
        MarketInfiniteScrollComponent,

        MarketTabComponent,
        MarketTabGroupComponent,

        MarketPanelComponent,
        MarketPanelGroupComponent,

        MarketInputComponent,
        MarketInputRangeComponent,
        MarketInputBooleanComponent,
        MarketInputSelectComponent,
        MarketInputSelectOptionComponent,
        MarketInputNumberComponent,

        MarketListingStatusComponent,

        MarketItemSearchComponent,
        MarketItemSearchResultComponent,
        MarketItemSearchBarComponent,
        MarketItemSearchStatsComponent,
        MarketItemSearchStatGroupComponent,
        MarketItemSearchStatComponent,
        MarketItemSearchFilterComponent,
        MarketItemSearchFilterTypeComponent,
        MarketItemSearchFilterMiscComponent,
        MarketItemSearchFilterTradeComponent,
        MarketItemSearchFilterHeistComponent,

        MarketExchangeComponent,
        MarketExchangeBarComponent,
        MarketExchangePriceComponent,
        MarketExchangeFilterComponent,
        MarketExchangeFilterItemComponent
    ],
    exports: [MarketWindowComponent],
    imports: [SharedModule]
})
export class MarketModule implements FeatureModule<MarketFeatureSettings> {

    constructor(private readonly marketWindow: MarketWindowService) { }

    public getConfig(): FeatureConfig<MarketFeatureSettings> {
        const config: FeatureConfig<MarketFeatureSettings> = {
            name: 'market.name',
            component: MarketSettingsComponent,
            default: {
            },
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            {
                hotkey: Hotkey.MarketToggle
            }
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey, settings: MarketFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.MarketToggle:
                this.marketWindow.toggle().subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }
}
