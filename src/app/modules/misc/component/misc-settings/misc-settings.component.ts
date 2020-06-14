import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { MiscFeatureSettings } from '@modules/misc/misc-feature-settings';

@Component({
  selector: 'app-misc-settings',
  templateUrl: './misc-settings.component.html',
  styleUrls: ['./misc-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscSettingsComponent extends FeatureSettingsComponent<MiscFeatureSettings> {
  public load(): void { }
}
