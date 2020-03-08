import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface MiscUserSettings extends UserSettings {
  miscStashNavigation: boolean;
  miscStashHighlight: boolean;
  miscWikiKeybinding: string;
  miscWikiExternalKeybinding: string;
  miscPoedbKeybinding: string;
  miscPoedbExternalKeybinding: string;
}

@Component({
  selector: 'app-misc-settings',
  templateUrl: './misc-settings.component.html',
  styleUrls: ['./misc-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscSettingsComponent implements UserSettingsComponent {
  public settings: MiscUserSettings;

  public load(): void {
    // stub
  }
}
