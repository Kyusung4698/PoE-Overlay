import { NgModule } from '@angular/core';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { SharedModule } from '@shared/shared.module';
import { TradeMessageActionComponent, TradeMessageBulkComponent, TradeMessageComponent, TradeMessageDirectionComponent, TradeMessageItemComponent, TradeMessageMapComponent, TradeMessageMapTierComponent, TradeSettingsComponent } from './component';
import { TradeService } from './service';
import { TradeFeatureSettings } from './trade-feature-settings';
import { TradeHighlightWindowComponent, TradeWindowComponent } from './window';

const WINDOWS = [
    TradeWindowComponent,
    TradeHighlightWindowComponent
];

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: TradeModule, multi: true }],
    declarations: [
        ...WINDOWS,
        TradeSettingsComponent,
        TradeMessageComponent,
        TradeMessageItemComponent,
        TradeMessageMapComponent,
        TradeMessageBulkComponent,
        TradeMessageActionComponent,
        TradeMessageDirectionComponent,
        TradeMessageMapTierComponent,
    ],
    exports: [...WINDOWS],
    imports: [SharedModule]
})
export class TradeModule implements FeatureModule<TradeFeatureSettings> {
    constructor(private readonly trade: TradeService) { }

    public getConfig(): FeatureConfig<TradeFeatureSettings> {
        const config: FeatureConfig<TradeFeatureSettings> = {
            name: 'trade.name',
            component: TradeSettingsComponent,
            default: {
            }
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [];
        return features;
    }

    public onLogLineAdd(line: string): void {
        this.trade.onLogLineAdd(line).subscribe();
    }
}
