import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClipboardService } from '@app/service/input';
import { SelectListItem } from '@shared/module/material/component/select-list/select-list.component';
import { SnackBarService } from '@shared/module/material/service';
import { StatsProvider } from '@shared/module/poe/provider/stats.provider';
import { StatsService } from '@shared/module/poe/service';
import { StatType } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface MapUserSettings extends UserSettings {
  mapInfoKeybinding: string;
  mapInfoWarningStats: any;
}

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSettingsComponent implements UserSettingsComponent {
  public settings: MapUserSettings;

  public stats$ = new BehaviorSubject<SelectListItem[]>([]);

  constructor(
    private readonly statsProvider: StatsProvider,
    private readonly statsService: StatsService,
    private readonly clipboard: ClipboardService,
    private readonly snackbar: SnackBarService) { }

  public load(): void {
    if (this.settings.language) {
      this.updateStats();
    }
  }

  public onStatsChange(stats: SelectListItem[]): void {
    this.settings.mapInfoWarningStats = {};
    stats.forEach(stat => {
      if (stat.selected) {
        this.settings.mapInfoWarningStats[stat.key] = true;
      }
    });
  }

  public onExportStats(): void {
    try {
      const stats = JSON.stringify(this.settings.mapInfoWarningStats, null, '\t');
      this.clipboard.writeText(stats);
      this.snackbar.success('stats were copied to clipboard successfully.');
    } catch (ex) {
      this.snackbar.error('stats could not be copied to clipboard.');
    }
  }

  public onImportStats(): void {
    const text = this.clipboard.readText();
    if (!text || text.length < 0) {
      this.snackbar.warning('clipboard was empty.');
      return;
    }

    let stats;
    try {
      stats = JSON.parse(text);
    } catch (ex) {
      this.snackbar.error('clipboard content could not be parsed.');
      return;
    }

    Object.getOwnPropertyNames(stats).forEach(key => {
      if (!this.stats$.value.find(x => x.key === key)) {
        delete stats[key];
      }
    });
    this.settings.mapInfoWarningStats = stats;
    this.updateStats();
    this.snackbar.success('stats were imported successfully.');
  }

  private updateStats(): void {
    const itemsContains = {};
    const items: SelectListItem[] = [];

    const types = [StatType.Explicit, StatType.Implicit, StatType.Crafted, StatType.Enchant, StatType.Fractured];
    types.forEach(type => {
      const stats = this.statsProvider.provide(type);
      Object.getOwnPropertyNames(stats).forEach(tradeId => {
        const stat = stats[tradeId];

        const key = stat.id;
        if (!key || key.indexOf('map_') !== 0 || itemsContains[key]) {
          return;
        }

        itemsContains[key] = true;

        const localStat = stat.text[this.settings.language];
        if (localStat) {
          const predicates = Object.getOwnPropertyNames(localStat);
          const predicate = predicates.find(x => (x[0] === 'N' && stat.negated) || !stat.negated);
          const item: SelectListItem = {
            key,
            text: this.statsService.translate(stat, predicate, this.settings.language),
            selected: !!this.settings.mapInfoWarningStats[key],
          };
          items.push(item);
        } else {
          console.warn(`Stat with ${tradeId} not found in ${this.settings.language}.`);
        }
      });
    });
    this.stats$.next(items);
  }
}
