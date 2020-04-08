import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AppTranslateService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service';
import { BehaviorSubject } from 'rxjs';
import { UserSettingsService } from '../../service';
import { UserSettings, UserSettingsFeature } from '../../type';

@Component({
  selector: 'app-user-settings',
  styleUrls: ['./user-settings.component.scss'],
  templateUrl: './user-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent implements OnInit {
  public init$ = new BehaviorSubject<boolean>(false);

  public settings: UserSettings;
  public features: UserSettingsFeature[];

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly settingsService: UserSettingsService,
    private readonly window: WindowService,
    private readonly context: ContextService,
    private readonly translate: AppTranslateService) {
  }

  public ngOnInit(): void {
    const { Titlebar, Color } = window.require('custom-electron-titlebar');
    const titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#7f7f7f'),
      menu: null,
      hideWhenClickingClose: true
    });
    titlebar.on('before-close', () => new Promise((resolve, reject) => {
      if (this.init$.value) {
        this.translate.use(this.settings.uiLanguage);
        this.window.setZoom(this.settings.zoom / 100);
        this.context.update({
          language: this.settings.language,
          leagueId: this.settings.leagueId
        });
        this.settingsService.save(this.settings).subscribe(resolve, reject);
      }
    }));
    titlebar.updateTitle('PoE Overlay - Settings');

    this.settingsService.init(this.modules).subscribe(settings => {
      this.translate.use(settings.uiLanguage);
      this.window.setZoom(settings.zoom / 100);
      this.context.init({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.settings = settings;
      this.features = this.settingsService.features();
      this.init$.next(true);
    });
  }
}
