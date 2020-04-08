import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrowserService } from '@app/service';

@Component({
  selector: 'app-user-settings-help',
  templateUrl: './user-settings-help.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsHelpComponent {
  constructor(private readonly browser: BrowserService) { }

  public openUrl(url: string): void {
    this.browser.open(url, true);
  }
}
