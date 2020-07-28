import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EnumValues } from '@app/enum';
import { FeatureSettingsComponent } from '@app/feature';
import { MiscFeatureSettings, MiscNavigation } from '@modules/misc/misc-feature-settings';

@Component({
  selector: 'app-misc-settings',
  templateUrl: './misc-settings.component.html',
  styleUrls: ['./misc-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscSettingsComponent extends FeatureSettingsComponent<MiscFeatureSettings> {
  public navigations = new EnumValues(MiscNavigation);

  public load(): void { }

  public onChange(): void {
    this.save();
  }
}
