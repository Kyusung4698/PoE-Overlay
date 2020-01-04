import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
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
    private readonly context: ContextService,
    private readonly window: WindowService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.unregisterShorcuts();
  }

  public ngOnInit(): void {
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

  public ngOnDestroy(): void {
    this.unregisterShorcuts();
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
      this.unregisterShorcuts();
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

  private unregisterShorcuts(): void {
    this.shortcut.unregisterAll();
  }
}
