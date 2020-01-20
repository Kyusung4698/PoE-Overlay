import { ChangeDetectionStrategy, Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { UserSettings, UserSettingsFeature } from '../../type';
import { UserSettingsFeatureContainerComponent } from '../user-settings-feature-container/user-settings-feature-container.component';

export interface UserSettingsDialogData {
  settings: UserSettings;
  features: UserSettingsFeature[];
}

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsDialogComponent {
  public settings: UserSettings;
  public features: UserSettingsFeature[];

  @ViewChildren(UserSettingsFeatureContainerComponent)
  public containers: QueryList<UserSettingsFeatureContainerComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) data: UserSettingsDialogData,
              private readonly window: WindowService) {
    this.settings = data.settings;
    this.features = data.features;
  }

  public onSelectedIndexChange(index: number): void {
    const containerIndex = index - 1;
    const container = this.containers.toArray()[containerIndex];
    if (container) {
      container.instance.load();
    }
  }

  public openUrl(url: string): void {
    this.window.open(url, true);
  }
}
