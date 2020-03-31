import { UserSettings, UserSettingsComponent } from '../../../../layout/type';
import { AfterContentInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginService } from "@modules/forum-trade/service/forum-trade-login.service";

export interface ForumTradeUserSettings extends UserSettings {
  sessionId: string,
  forumThread: string,
  priceKeyBinding: string
}

@Component({
  selector: 'app-forum-trade-settings',
  templateUrl: './forum-trade-settings.component.html',
  styleUrls: ['./forum-trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ForumTradeSettingsComponent implements UserSettingsComponent, AfterContentInit {
  settings: ForumTradeUserSettings;
  private accountName: string = 'undefined';

  constructor(
    private readonly loginService: LoginService
  ) {
  }

  load(): void {
  }

  private updateForumThread(inputElement: HTMLInputElement) {
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

  private openLoginPage() {
    this.loginService.openLoginPage();
    this.loginService.getAccountName().subscribe((name) =>
      this.accountName = name
    )
  }

  ngAfterContentInit() {
    this.loginService.getAccountName().subscribe((name) =>
      this.accountName = name
    )
  }
}
