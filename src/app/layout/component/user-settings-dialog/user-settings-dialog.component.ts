import { ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  @Input()
  public settings: UserSettings;

  @Input()
  public features: UserSettingsFeature[];

  @ViewChildren(UserSettingsFeatureContainerComponent)
  public containers: QueryList<UserSettingsFeatureContainerComponent>;

  public onSelectedIndexChange(index: number): void {
    const containerIndex = index - 1;
    const container = this.containers.toArray()[containerIndex];
    if (container) {
      container.instance.load();
    }
  }
}
