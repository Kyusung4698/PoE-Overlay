import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { ReplayFeatureSettings } from '@modules/replay/replay-feature-settings';

@Component({
  selector: 'app-replay-settings',
  templateUrl: './replay-settings.component.html',
  styleUrls: ['./replay-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplaySettingsComponent extends FeatureSettingsComponent<ReplayFeatureSettings> {
  public displayDuration = (value: number) => `${value}s`;

  public load(): void { }

  public onCaptureChange(): void {
    this.save();
  }

  public onDurationChange(): void {
    this.save();
  }
}
