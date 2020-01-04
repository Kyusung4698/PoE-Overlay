import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ReleasesHttpService } from '@data/github';
import { ContextService } from '@shared/module/poe/service';
import { Context } from '@shared/module/poe/type';
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
  public version: string = version;

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly releasesHttpService: ReleasesHttpService,
    private readonly userSettingsService: UserSettingsService,
    private readonly context: ContextService,
    private readonly window: WindowService,
    private readonly shortcut: ShortcutService) { }

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

  private initSettings(): void {
    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.context.init(this.getContext(settings));
      this.registerShortcuts(settings);
    });
  }

  private registerShortcuts(settings: UserSettings): void {
    this.registerFeatures(settings);
    this.registerSettings();
    this.registerExit();
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

  private registerSettings(): void {
    this.shortcut.register('F7').subscribe(() => {
      this.unregisterShortcuts();
      this.window.openRoute('user-settings').subscribe(() => {
        this.userSettingsService.get().subscribe(settings => {
          this.context.update(this.getContext(settings));
          this.registerShortcuts(settings);
        });
      });
    });
  }

  private registerExit(): void {
    this.shortcut.register('F8').subscribe(() => this.window.quit());
  }

  private unregisterShortcuts(): void {
    this.shortcut.unregisterAll();
  }

  private getContext(settings: UserSettings): Context {
    const context: Context = {
      language: settings.language,
      leagueId: settings.leagueId
    };
    return context;
  }
}
