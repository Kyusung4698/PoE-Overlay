import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ReleasesHttpService } from '@data/github/index.js';
import { ContextService } from '@shared/module/poe/service/context.service';
import { version } from '../../package.json';
import { UserSettingsDialogService, UserSettingsFeatureService, UserSettingsService } from './layout/service';
import { UserSettings } from './layout/type/index.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  public version: string = version;

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly shortcut: ShortcutService,
    private readonly userSettings: UserSettingsService,
    private readonly userSettingsFeatureService: UserSettingsFeatureService,
    private readonly userSettingsDialog: UserSettingsDialogService,
    private readonly releasesHttpService: ReleasesHttpService,
    private readonly context: ContextService,
    private readonly window: WindowService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.unregisterShortcuts();
  }

  public ngOnInit(): void {
    this.checkVersion();
    this.loadSettingsAndShortcuts();
  }

  public ngOnDestroy(): void {
    this.unregisterShortcuts();
  }

  private checkVersion(): void {
    this.releasesHttpService.getLatestRelease().subscribe(release => {
      if (release && release.tag_name !== version && release.assets && release.assets[0].browser_download_url) {
        if (confirm(`A new version: '${release.tag_name}' is available. Go to download Page?`)) {
          this.window.open(release.html_url);
        }
      }
    });
  }

  private loadSettingsAndShortcuts(): void {
    this.userSettings.get().subscribe(savedSettings => {
      let mergedSettings: UserSettings = {};

      this.modules.forEach(x => {
        const featureSettings = x.getSettings();
        mergedSettings = {
          ...mergedSettings,
          ...featureSettings.defaultSettings
        };
        this.userSettingsFeatureService.register(featureSettings);
      });

      mergedSettings = {
        ...mergedSettings,
        ...savedSettings
      };

      this.userSettings.save(mergedSettings).subscribe(settings => {
        this.context.init({
          language: settings.language,
          leagueId: settings.leagueId
        });
        this.registerShortcuts(settings);
      });
    });
  }

  private registerShortcuts(userSettings: UserSettings): void {
    this.modules.forEach(mod => {
      const features = mod.getFeatures(userSettings);
      features.forEach(feature => {
        if (feature.shortcut) {
          this.shortcut.register(feature.shortcut).subscribe(() => {
            mod.run(feature.name, userSettings);
          });
        }
      });
    });

    this.shortcut.register('F7').subscribe(() => {
      this.unregisterShortcuts();
      this.userSettingsDialog.open().subscribe(newSettings => {
        if (newSettings) {
          this.context.update({
            language: newSettings.language,
            leagueId: newSettings.leagueId
          });
          this.registerShortcuts(newSettings);
        } else {
          this.registerShortcuts(userSettings);
        }
      });
    });

    this.shortcut.register('F8').subscribe(() => {
      this.window.quit();
    });
  }

  private unregisterShortcuts(): void {
    this.shortcut.unregisterAll();
  }
}
