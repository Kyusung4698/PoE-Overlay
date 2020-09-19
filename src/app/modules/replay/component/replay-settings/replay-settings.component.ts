import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { OWReplay } from '@app/odk';
import { ReplayFeatureSettings } from '@modules/replay/replay-feature-settings';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-replay-settings',
  templateUrl: './replay-settings.component.html',
  styleUrls: ['./replay-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplaySettingsComponent extends FeatureSettingsComponent<ReplayFeatureSettings> implements OnInit {
  public path$: Observable<string>;

  public displayDuration = (value: number) => `${value}s`;

  public ngOnInit(): void {
    this.path$ = OWReplay.path();
  }

  public load(): void { }

  public onCaptureChange(): void {
    this.save();
  }

  public onDurationChange(): void {
    this.save();
  }
}
