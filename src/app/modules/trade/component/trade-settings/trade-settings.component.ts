import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AudioService } from '@app/audio';
import { EnumValues } from '@app/enum';
import { FeatureSettingsComponent } from '@app/feature';
import { TradeFeatureSettings, TradeFilter, TradeLayout } from '@modules/trade/trade-feature-settings';

@Component({
  selector: 'app-trade-settings',
  templateUrl: './trade-settings.component.html',
  styleUrls: ['./trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeSettingsComponent extends FeatureSettingsComponent<TradeFeatureSettings> {

  constructor(private readonly audio: AudioService) {
    super();
  }

  public layouts = new EnumValues(TradeLayout);
  public filters = new EnumValues(TradeFilter);
  public displayWithPercentage = (volume: number) => `${volume}%`;

  public load(): void { }

  public onChange(): void {
    this.save();
  }

  public onPlay(): void {
    this.audio.play(this.settings.tradeSound, this.settings.tradeSoundVolume / 100);
  }

  public onSelect(input: HTMLInputElement): void {
    input.click();
  }

  public onSelected(input: HTMLInputElement): void {
    if (input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.settings.tradeSound = e.target.result as string;
        this.save();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
