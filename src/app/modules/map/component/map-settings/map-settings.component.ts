import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface MapUserSettings extends UserSettings {
  mapInfoKeybinding: string;
}

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSettingsComponent implements UserSettingsComponent {
  public settings: MapUserSettings;

  public load(): void {
    // stub
  }
}
