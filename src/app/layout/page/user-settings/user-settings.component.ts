import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppTranslateService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserSettingsService } from '../../service';
import { UserSettings, UserSettingsFeature } from '../../type';

@Component({
  selector: 'app-user-settings',
  styleUrls: ['./user-settings.component.scss'],
  templateUrl: './user-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  public settings$ = new BehaviorSubject<UserSettings>(undefined);
  public features$ = new Subject<UserSettingsFeature[]>();

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly userSettingsService: UserSettingsService,
    private readonly window: WindowService,
    private readonly context: ContextService,
    private readonly translate: AppTranslateService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.removeAllListeners();
  }

  public ngOnInit(): void {
    const { Titlebar, Color } = window.require('custom-electron-titlebar');
    const titlebar = new Titlebar({
      backgroundColor: Color.fromHex('#7f7f7f'),
      menu: null,
      hideWhenClickingClose: true
    });
    titlebar.on('before-close', () => new Promise((resolve, reject) => {
      this.userSettingsService.save(this.settings$.value).subscribe(resolve, reject);
    }));
    titlebar.updateTitle('PoE Overlay - Settings');

    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.translate.use(settings.uiLanguage);
      this.window.setZoom(settings.zoom / 100);
      this.context.init({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.settings$.next(settings);
      this.features$.next(this.userSettingsService.features());
      this.registerEvents();
    });
  }

  public ngOnDestroy(): void {
    this.removeAllListeners();
  }

  private registerEvents(): void {
    this.window.on('show').pipe(
      flatMap(() => this.userSettingsService.get())
    ).subscribe(settings => {
      this.translate.use(settings.uiLanguage);
      this.window.setZoom(settings.zoom / 100);
      this.context.update({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.settings$.next(settings);
      this.features$.next(this.userSettingsService.features());
    });
  }

  private removeAllListeners(): void {
    this.window.removeAllListeners();
  }
}
