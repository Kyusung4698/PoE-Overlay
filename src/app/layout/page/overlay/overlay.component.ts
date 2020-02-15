import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppService, BrowserService, DialogsService, RendererService, ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule, VisibleFlag } from '@app/type';
import { ReleasesHttpService } from '@data/github';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from '@shared/module/poe/service';
import { Context, Language } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { version } from '../../../../../package.json';
import { UserSettingsService } from '../../service/user-settings.service';
import { UserSettings } from '../../type';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy {
  private userSettingsOpen: Observable<void>;

  public version = version;
  public displayVersion$ = new BehaviorSubject(true);

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly releasesHttpService: ReleasesHttpService,
    private readonly userSettingsService: UserSettingsService,
    private readonly context: ContextService,
    private readonly app: AppService,
    private readonly window: WindowService,
    private readonly browser: BrowserService,
    private readonly renderer: RendererService,
    private readonly shortcut: ShortcutService,
    private readonly dialogs: DialogsService,
    private readonly translate: TranslateService) {
    this.translate.setDefaultLang(`${Language.English}`);
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.reset();
  }

  public ngOnInit(): void {
    this.checkVersion();
    this.initSettings();
  }

  public ngOnDestroy(): void {
    this.reset();
  }

  private checkVersion(): void {
    this.releasesHttpService.getLatestRelease().subscribe(release => {
      if (release && release.tag_name !== version && release.assets && release.assets[0].browser_download_url) {
        if (confirm(`A new version: '${release.tag_name}' is available. Go to download Page?`)) {
          this.browser.open(release.html_url);
        }
      }
    });
  }

  private initSettings(): void {
    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.translate.use(`${settings.language}`);
      this.displayVersion$.next(settings.displayVersion);
      this.context.init(this.getContext(settings));

      this.register(settings);
      this.registerVisibleChange();

      this.renderer.on('show-user-settings').subscribe(() => {
        this.openUserSettings();
      });
    });
  }

  private registerVisibleChange(): void {
    this.app.visibleChange().subscribe(flag => {
      if (flag === VisibleFlag.None) {
        this.window.hide();
      } else {
        this.window.show();
      }
      this.shortcut.check(flag);
    });
  }

  private openUserSettings(): void {
    if (!this.userSettingsOpen) {
      this.userSettingsOpen = this.renderer.open('user-settings');
      this.userSettingsOpen.pipe(
        flatMap(() => this.userSettingsService.get())
      ).subscribe(settings => {
        this.userSettingsOpen = null;

        this.translate.use(`${settings.language}`);
        this.displayVersion$.next(settings.displayVersion);
        this.context.update(this.getContext(settings));

        this.register(settings);
        this.app.triggerVisibleChange();
      }, () => this.userSettingsOpen = null);
      this.reset();
    }
  }

  private reset(): void {
    this.dialogs.reset();
    this.shortcut.reset();
  }

  private register(settings: UserSettings): void {
    this.registerFeatures(settings);
    this.registerSettings(settings);
    this.dialogs.register();
  }

  private registerFeatures(settings: UserSettings): void {
    this.modules.forEach(mod => {
      const features = mod.getFeatures(settings);
      features.forEach(feature => {
        if (feature.accelerator) {
          this.shortcut.add(feature.accelerator, !!feature.passive).subscribe(() => {
            mod.run(feature.name, settings);
          });
        }
      });
    });
  }

  private registerSettings(settings: UserSettings): void {
    if (settings.openUserSettingsKeybinding) {
      this.shortcut.add(settings.openUserSettingsKeybinding).subscribe(() => this.openUserSettings());
    }
    if (settings.exitAppKeybinding) {
      this.shortcut.add(settings.exitAppKeybinding).subscribe(() => this.app.quit());
    }
  }

  private getContext(settings: UserSettings): Context {
    const context: Context = {
      language: settings.language,
      leagueId: settings.leagueId
    };
    return context;
  }
}
