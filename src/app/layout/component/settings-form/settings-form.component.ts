import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UiLanguage } from '@app/config';
import { EnumValues } from '@app/enum';
import { FeatureSettings } from '@app/feature';
import { Language } from '@data/poe/schema';
import { League, TradeLeaguesService } from '@shared/module/poe/trade';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsFormComponent implements OnInit {
  public languages = new EnumValues(Language);
  public uiLanguages = new EnumValues(UiLanguage);

  public leagues$ = new BehaviorSubject<League[]>([]);

  @Input()
  public settings: FeatureSettings;

  @Output()
  public settingsChange = new EventEmitter<FeatureSettings>();

  public displayWithOpacity = (value: number) => `${Math.round(value / 1 * 100)}%`;

  constructor(
    private readonly leagues: TradeLeaguesService) { }

  public ngOnInit(): void {
    this.updateLeagues();
  }

  public onChange(): void {
    this.update();
  }

  public onLanguageChange(): void {
    this.updateLeagues();
    this.update();
  }

  private updateLeagues(): void {
    const { leagueId, language } = this.settings;
    this.leagues.get(language).subscribe(leagues => {
      const selectedLeague = leagues.find(league => league.id === leagueId);
      if (!selectedLeague) {
        this.settings.leagueId = leagues[0].id;
      }
      this.leagues$.next(leagues);
    });
  }

  private update(): void {
    this.settingsChange.next(this.settings);
  }
}
