import { ChangeDetectionStrategy, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserSettingsFeatureService } from '../../service/user-settings-feature.service';
import { UserSettings, UserSettingsFeature } from '../../type';
import { UserSettingsFeatureContainerComponent } from '../user-settings-feature-container/user-settings-feature-container.component';

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsDialogComponent implements OnInit {
  public features: UserSettingsFeature[];

  @ViewChildren(UserSettingsFeatureContainerComponent)
  public containers: QueryList<UserSettingsFeatureContainerComponent>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public settings: UserSettings,
    private readonly featureService: UserSettingsFeatureService) { }

  public ngOnInit() {
    this.features = this.featureService.get();
  }

  public onSelectedIndexChange(index: number): void {
    const containerIndex = index - 1;
    const container = this.containers.toArray()[containerIndex];
    if (container) {
      container.instance.load();
    }
  }
}
