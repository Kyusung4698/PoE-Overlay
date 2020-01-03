import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumValues } from '@app/class';
import { LeaguesProvider } from '@shared/module/poe/provider';
import { Language, League } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings } from '../../type';

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsDialogComponent implements OnInit {
  public languages = new EnumValues(Language);
  public leagues$ = new BehaviorSubject<League[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public settings: UserSettings,
    private readonly leaguesProvider: LeaguesProvider) { }

  public ngOnInit() {
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
