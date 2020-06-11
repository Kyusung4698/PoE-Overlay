import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { MarketFeatureSettings } from '@modules/market/market-feature-settings';

@Component({
  selector: 'app-market-settings',
  templateUrl: './market-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketSettingsComponent extends FeatureSettingsComponent<MarketFeatureSettings> {
  public load(): void { }
}
