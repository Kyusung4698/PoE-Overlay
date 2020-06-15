import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AudioFile, AudioService } from '@app/audio';
import { FeatureSettingsComponent } from '@app/feature';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';

@Component({
  selector: 'app-trade-settings',
  templateUrl: './trade-settings.component.html',
  styleUrls: ['./trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeSettingsComponent extends FeatureSettingsComponent<TradeFeatureSettings> {
  public displayWithVolume = (volume: number) => `${volume}%`;

  constructor(private readonly audio: AudioService) {
    super();
  }

  public load(): void { }

  public onChange(): void {
    this.save();
  }

  public onPlay(): void {
    this.audio.play(AudioFile.Notification, this.settings.tradeSoundVolume / 100);
  }
}
