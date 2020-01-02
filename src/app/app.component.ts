import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service/context.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { version } from '../../package.json';
import { UserSettingsDialogService, UserSettingsService } from './layout/service';
import { UserSettings } from './layout/type/index.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private settingsDialogOpen: Observable<UserSettings> = null;

  public version: string = version;

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly shortcut: ShortcutService,
    private readonly userSettings: UserSettingsService,
    private readonly userSettingsDialog: UserSettingsDialogService,
    private readonly context: ContextService,
    private readonly window: WindowService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.cleanup();
  }

  public ngOnInit(): void {
    this.userSettings.get().subscribe(settings => {
      this.context.init({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.register();
    });
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }

  private register(): void {
    this.modules.forEach(x => {
      const features = x.getFeatures();
      features.forEach(feature => {
        this.shortcut.register(feature.defaultShortcut).subscribe(() => {
          x.run(feature.name);
        });
      });
    });

    this.shortcut.register('F7').subscribe(() => {
      if (!this.settingsDialogOpen) {
        this.settingsDialogOpen = this.userSettingsDialog.open().pipe(
          finalize(() => this.settingsDialogOpen = null)
        );
        this.settingsDialogOpen.subscribe(settings => {
          if (settings) {
            this.context.update({
              language: settings.language,
              leagueId: settings.leagueId
            });
          }
        });
      }
    });

    this.shortcut.register('F8').subscribe(() => {
      this.window.quit();
    });
  }

  private cleanup(): void {
    this.shortcut.cleanup();
  }
}
