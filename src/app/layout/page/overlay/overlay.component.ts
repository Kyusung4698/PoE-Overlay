import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppService, BrowserService, RendererService, ShortcutService, VisibleFlag, WindowService } from '@app/service';
import { DialogsService } from '@app/service/input/dialogs.service.js';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ReleasesHttpService } from '@data/github';
import { TranslateService } from '@ngx-translate/core';
import { ContextService } from '@shared/module/poe/service';
import { Context, Language } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';
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

  public version: string = version;

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
    this.unregisterShortcuts();
  }

  public ngOnInit(): void {
    this.checkVersion();
    this.initSettings();
  }

  public ngOnDestroy(): void {
    this.unregisterShortcuts();
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
      this.context.init(this.getContext(settings));
      this.registerVisibleChange();
      this.renderer.on('show-user-settings').subscribe(() => {
        this.openUserSettings();
      });
    });
  }

  private registerVisibleChange(): void {
    this.app.visibleChange().pipe(
      map(flag => {
        if (flag === VisibleFlag.None) {
          this.window.hide();
        } else {
          this.window.show();
        }

        const visible = (flag & VisibleFlag.Game) === VisibleFlag.Game;
        if (!visible) {
          this.unregisterShortcuts();
        }
        return visible;
      }),
      distinctUntilChanged(),
      filter(x => x),
      delay(500)
    ).subscribe(() => {
      this.registerShortcuts();
    });
  }

  private openUserSettings(): void {
    if (!this.userSettingsOpen) {
      this.unregisterShortcuts();
      this.userSettingsOpen = this.renderer.open('user-settings');

      this.userSettingsOpen.subscribe(() => {
        this.userSettingsOpen = null;
        this.userSettingsService.get().subscribe(settings => {
          this.translate.use(`${settings.language}`);
          this.context.update(this.getContext(settings));
          this.registerShortcuts();
        });
      }, () => this.userSettingsOpen = null);
    }
  }

  private registerShortcuts(): void {
    this.userSettingsService.get().subscribe(settings => {
      this.registerFeatures(settings);
      this.registerSettings(settings);
      this.registerExit(settings);
      this.dialogs.registerShortcuts();
    });
  }

  private unregisterShortcuts(): void {
    this.shortcut.unregisterAll();
    this.dialogs.unregisterShortcuts();
  }

  private registerFeatures(settings: UserSettings): void {
    this.modules.forEach(mod => {
      const features = mod.getFeatures(settings);
      features.forEach(feature => {
        if (feature.shortcut) {
          this.shortcut.register(feature.shortcut).subscribe(() => {
            mod.run(feature.name, settings);
          });
        }
      });
    });
  }

  private registerSettings(settings: UserSettings): void {
    if (settings.openUserSettingsKeybinding) {
      this.shortcut.register(settings.openUserSettingsKeybinding).subscribe(() => this.openUserSettings());
    }
  }

  private registerExit(settings: UserSettings): void {
    if (settings.exitAppKeybinding) {
      this.shortcut.register(settings.exitAppKeybinding).subscribe(() => this.app.quit());
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
