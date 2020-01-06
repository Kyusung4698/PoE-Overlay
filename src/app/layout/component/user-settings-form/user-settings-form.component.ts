import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EnumValues } from '@app/class';
import { LeaguesProvider } from '@shared/module/poe/provider';
import { Language, League } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings } from '../../type';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsFormComponent implements OnInit {
  public languages = new EnumValues(Language);

  public leagues$ = new BehaviorSubject<League[]>([]);

  @Input()
  public settings: UserSettings;

  constructor(private readonly leaguesProvider: LeaguesProvider) { }

  public ngOnInit(): void {
    if (this.settings.language) {
      this.updateLeagues();
    }
  }

  public onLanguageChange(): void {
    this.updateLeagues();
  }

  private updateLeagues(): void {
    this.leaguesProvider.provide(this.settings.language).subscribe(leagues => {
      const selectedLeague = leagues.find(league => league.id === this.settings.leagueId);
      if (!selectedLeague) {
        this.settings.leagueId = leagues[0].id;
      }
      this.leagues$.next(leagues);
    });
  }
}
