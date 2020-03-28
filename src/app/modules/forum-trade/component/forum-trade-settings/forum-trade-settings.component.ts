import { UserSettings, UserSettingsComponent } from '../../../../layout/type';
import { ChangeDetectionStrategy, Component } from '@angular/core';

export enum LoginType {
  ACCOUNT,
  POE_ID
}

type SessionId = string
type Account = { login: string, password: string }

export interface ForumTradeUserSettings extends UserSettings {
  loginType: LoginType,
  credentials: Account | SessionId,
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

  setLoginType(type: string) {
    switch (type) {
      case '0':
        this.settings.loginType = LoginType.ACCOUNT;
        this.settings.credentials = { login: '', password: '' };
        break;
      case '1':
        this.settings.loginType = LoginType.POE_ID;
        this.settings.credentials = '';
        break;
    }
  }

  updateForumThread(inputElement: HTMLInputElement) {
    const forumPageRegex = new RegExp('^https://.*pathofexile.com/forum/view-thread/(\\d{6,8}).*$');
    const rawIdRegex = /^\d{6,8}$/;
    const content = inputElement.value;
    const pageMatch: RegExpMatchArray = content.match(forumPageRegex);

    if (pageMatch != null) {
      this.settings.forumThread = pageMatch[1];
    } else if (rawIdRegex.test(content)) {
      this.settings.forumThread = content;
    }
  }
}
