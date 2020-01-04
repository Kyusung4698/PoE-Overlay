import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service';
import { UserSettingsService } from '../../service';

@Component({
  selector: 'app-user-settings',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent implements OnInit {

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly userSettingsService: UserSettingsService,
    private readonly window: WindowService,
    private readonly context: ContextService) { }

  public ngOnInit(): void {
    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.context.init({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.userSettingsService.edit(settings).subscribe(() => {
        this.window.close();
      });
    });
  }
}
