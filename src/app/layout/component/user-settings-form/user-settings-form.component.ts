import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EnumValues } from '@app/class';
import { AppService, AppTranslateService, WindowService } from '@app/service';
import { UiLanguage } from '@app/type';
import { LeaguesService } from '@shared/module/poe/service';
import { Language, League } from '@shared/module/poe/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserSettings } from '../../type';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsFormComponent implements OnInit {
  public languages = new EnumValues(Language);
  public uiLanguages = new EnumValues(UiLanguage);

  public leagues$ = new BehaviorSubject<League[]>([]);
  public autoLaunchEnabled$: Observable<boolean>;
  public downloadAvailable$: Observable<boolean>;

  @Input()
  public settings: UserSettings;

  constructor(
    private readonly leagues: LeaguesService,
    private readonly app: AppService,
    private readonly translate: AppTranslateService,
    private readonly window: WindowService) { }

  public ngOnInit(): void {
    if (this.settings.language) {
      this.updateLeagues();
    }
    this.autoLaunchEnabled$ = this.app.isAutoLaunchEnabled();
  }

  public onAutoLaunchChange(enabled: boolean): void {
    this.autoLaunchEnabled$ = this.app.updateAutoLaunchEnabled(enabled).pipe(
      map(success => success ? enabled : !enabled)
    );
  }

  public onLanguageChange(): void {
    this.updateLeagues();
  }

  public onUiLanguageChange(): void {
    this.translate.use(this.settings.uiLanguage);
  }

  public onZoomChange(): void {
    this.window.setZoom(this.settings.zoom / 100);
  }

  private updateLeagues(): void {
    this.leagues.get(this.settings.language).subscribe(leagues => {
      const selectedLeague = leagues.find(league => league.id === this.settings.leagueId);
      if (!selectedLeague) {
        this.settings.leagueId = leagues[0].id;
      }
      this.leagues$.next(leagues);
    });
  }

  public relaunchApp(): void {
    this.app.relaunch();
  }

  public exitApp(): void {
    this.app.quit();
  }
}
