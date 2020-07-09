import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';

@Component({
  selector: 'app-settings-support',
  templateUrl: './settings-support.component.html',
  styleUrls: ['./settings-support.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSupportComponent {
  public onOpenUrl(url: string): void {
    OWUtils.openUrl(url, true);
  }

  public onOpenSubscription(): void {
    OWUtils.openSubscriptionPage();
  }
}
