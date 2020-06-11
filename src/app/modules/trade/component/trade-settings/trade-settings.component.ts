import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';

@Component({
  selector: 'app-trade-settings',
  templateUrl: './trade-settings.component.html',
  styleUrls: ['./trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeSettingsComponent extends FeatureSettingsComponent<TradeFeatureSettings> {
  public load(): void { }
}
