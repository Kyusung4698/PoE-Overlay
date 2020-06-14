import { NgModule } from '@angular/core';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { RunningGameInfo } from '@app/odk';
import { SharedModule } from '@shared/shared.module';
import { TradeMessageActionComponent, TradeMessageBulkComponent, TradeMessageComponent, TradeMessageDirectionComponent, TradeMessageItemComponent, TradeMessageMapComponent, TradeMessageMapTierComponent, TradeSettingsComponent } from './component';
import { TradeService, TradeWindowService } from './service';
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
    private enabled = false;

    constructor(
        private readonly trade: TradeService,
        private readonly window: TradeWindowService) { }

    public getConfig(): FeatureConfig<TradeFeatureSettings> {
        const config: FeatureConfig<TradeFeatureSettings> = {
            name: 'trade.name',
            component: TradeSettingsComponent,
            default: {
                tradeEnabled: true,
                tradeMessageWait: 'Currently in @zone. Do you want to wait until finished?',
                tradeMessageStillInterested: 'Do you still want @itemname for @price?',
                tradeMessageItemGone: 'Sorry, @itemname already gone. Good luck on your search.',
                tradeMessageThanks: 'Thank you for the trade. Have a nice day and good luck.',
                tradeStashFactor: {},
                tradeWindowPinned: false
            }
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [];
        return features;
    }

    public onSettingsChange(settings: TradeFeatureSettings): void {
        if (settings.tradeEnabled) {
            this.window.restore(settings).subscribe();
        } else {
            this.window.close().subscribe();
            this.trade.clear();
        }
        this.enabled = settings.tradeEnabled;
    }

    public onInfo(info: RunningGameInfo, settings: TradeFeatureSettings): void {
        const { isRunning } = info;
        if (isRunning) {
            if (settings.tradeEnabled) {
                this.window.restore(settings).subscribe();
            }
        } else {
            this.window.close().subscribe();
            this.trade.clear();
        }
        this.enabled = settings.tradeEnabled;
    }

    public onLogLineAdd(line: string): void {
        if (this.enabled) {
            this.trade.onLogLineAdd(line);
        }
    }
}
