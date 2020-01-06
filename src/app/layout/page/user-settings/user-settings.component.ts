import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service';
import { flatMap, tap } from 'rxjs/operators';
import { UserSettingsService } from '../../service';

@Component({
  selector: 'app-user-settings',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly userSettingsService: UserSettingsService,
    private readonly window: WindowService,
    private readonly context: ContextService) { }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.removeAllListeners();
  }

  public ngOnInit(): void {
    this.userSettingsService.init(this.modules).subscribe(settings => {
      this.context.init({
        language: settings.language,
        leagueId: settings.leagueId
      });
      this.userSettingsService.edit(settings).subscribe(() => {
        this.window.hide();
        this.registerShow();
      });
    });
  }

  public ngOnDestroy(): void {
    this.removeAllListeners();
  }

  private registerShow(): void {
    this.window.on('show').subscribe(() => {
      this.userSettingsService.get().pipe(
        tap(settings => this.context.update({
          language: settings.language,
          leagueId: settings.leagueId
        })),
        flatMap(settings => this.userSettingsService.edit(settings))
      ).subscribe(() => {
        this.window.hide();
      });
    });
  }

  private removeAllListeners(): void {
    this.window.removeAllListeners();
  }
}
