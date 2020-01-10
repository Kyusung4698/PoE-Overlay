import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface ToolUserSettings extends UserSettings {
  toolStorageLeft: string;
  toolStorageRight: string;
}

@Component({
  selector: 'app-tool-settings',
  templateUrl: './tool-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolSettingsComponent implements UserSettingsComponent {
  public settings: ToolUserSettings;

  public load(): void {
    // stub
  }
}
