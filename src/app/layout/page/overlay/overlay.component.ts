import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppService, AppTranslateService, GameService, RendererService, SessionService, WindowService } from '@app/service';
import { DialogRefService } from '@app/service/dialog';
import { ShortcutService } from '@app/service/input';
import { FEATURE_MODULES } from '@app/token';
import { AppUpdateState, FeatureModule, VisibleFlag } from '@app/type';
import { SnackBarService } from '@shared/module/material/service';
import { ContextService } from '@shared/module/poe/service';
import { Context } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, flatMap, map, tap } from 'rxjs/operators';
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

  public version$ = new BehaviorSubject<string>('');
  public displayVersion$ = new BehaviorSubject(true);

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly userSettingsService: UserSettingsService,
    private readonly context: ContextService,
    private readonly app: AppService,
    private readonly session: SessionService,
    private readonly translate: AppTranslateService,
    private readonly snackBar: SnackBarService,
    private readonly window: WindowService,
    private readonly game: GameService,
    private readonly renderer: RendererService,
    private readonly shortcut: ShortcutService,
    private readonly dialogRef: DialogRefService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.reset();
  }

  public ngOnInit(): void {
    this.version$.next(this.app.version());
    this.initSettings();
  }

  public ngOnDestroy(): void {
    this.reset();
  }

  private initSettings(): void {
    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.translate.use(settings.uiLanguage);
      this.displayVersion$.next(settings.displayVersion);
      this.window.setZoom(settings.zoom / 100);
      this.context.init(this.getContext(settings));

      this.registerEvents(settings);
      this.register(settings);
      this.registerVisibleChange();

      this.renderer.on('show-user-settings').subscribe(() => {
        this.openUserSettings();
      });
      this.renderer.on('reset-zoom').subscribe(() => {
        this.userSettingsService.update(x => {
          x.zoom = 100;
          return x;
        }).subscribe(x => {
          this.window.setZoom(x.zoom / 100);
        });
      })
    });
  }

  private registerEvents(settings: UserSettings): void {
    this.app.updateStateChange().subscribe(event => {
      switch (event) {
        case AppUpdateState.Available:
          this.snackBar.info('app.update.available');
          break;
        case AppUpdateState.Downloaded:
          this.snackBar.success('app.update.downloaded');
          break;
        default:
          break;
      }
    });
    this.app.registerEvents(settings.autoDownload);
    this.session.registerEvents();
  }

  private registerVisibleChange(): void {

    this.app.visibleChange().pipe(
      tap(flag => this.shortcut.check(flag)),
      map(flag => flag !== VisibleFlag.None),
      distinctUntilChanged()
    ).subscribe(show => {
      if (!show) {
        this.window.hide();
      } else {
        this.window.show();
        this.game.focus();
      }
    });
    this.app.triggerVisibleChange();
  }

  private openUserSettings(): void {
    if (!this.userSettingsOpen) {
      this.userSettingsOpen = this.renderer.open('user-settings');
      this.userSettingsOpen.pipe(
        flatMap(() => this.userSettingsService.get())
      ).subscribe(settings => {
        this.userSettingsOpen = null;

        this.translate.use(settings.uiLanguage);
        this.window.setZoom(settings.zoom / 100);
        this.displayVersion$.next(settings.displayVersion);
        this.context.update(this.getContext(settings));

        this.app.updateAutoDownload(settings.autoDownload);
        this.register(settings);
        this.app.triggerVisibleChange();
      }, () => this.userSettingsOpen = null);
      this.reset();
    }
  }

  private reset(): void {
    this.dialogRef.reset();
    this.shortcut.reset();
  }

  private register(settings: UserSettings): void {
    this.registerFeatures(settings);
    this.registerSettings(settings);
    this.dialogRef.register();
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
