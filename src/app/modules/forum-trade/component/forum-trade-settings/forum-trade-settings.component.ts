import {UserSettings, UserSettingsComponent} from '../../../../layout/type';
import {ChangeDetectionStrategy, Component} from '@angular/core';

export enum LoginType {
  Account,
  Steam,
  POEId
}

export interface ForumTradeUserSettings extends UserSettings {
  enabled: boolean,
  loginType: LoginType,
  forumThread: string,
  priceKeyBinding: string
}

@Component({
  selector: 'app-forum-trade-settings',
  templateUrl: './forum-trade-settings.component.html',
  styleUrls: ['./forum-trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForumTradeSettingsComponent implements UserSettingsComponent {
  settings: ForumTradeUserSettings;

  load(): void {
  }
}
