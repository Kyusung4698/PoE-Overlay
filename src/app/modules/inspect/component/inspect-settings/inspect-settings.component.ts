import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hotkey } from '@app/config';
import { FeatureSettingsComponent } from '@app/feature';
import { Language } from '@data/poe/schema';
import { InspectFeatureSettings } from '@modules/inspect/inspect-feature-settings';
import { SelectListItem } from '@shared/module/material/component';
import { StatsProvider, StatsService, StatType } from '@shared/module/poe/item/stat';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-inspect-settings',
  templateUrl: './inspect-settings.component.html',
  styleUrls: ['./inspect-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectSettingsComponent extends FeatureSettingsComponent<InspectFeatureSettings> {
  private language: Language;

  public stats$ = new BehaviorSubject<SelectListItem[]>([]);

  public inspect = Hotkey.Inspect;

  constructor(
    private readonly statsProvider: StatsProvider,
    private readonly statsService: StatsService) {
    super();
  }

  public load(): void {
    const { language } = this.settings;
    if (language && this.language !== language) {
      this.language = language;
      this.updateStats();
    }
  }

  public onStatsChange(stats: SelectListItem[]): void {
    this.settings.inspectMapStatWarning = {};
    stats.forEach(stat => {
      if (stat.selected) {
        this.settings.inspectMapStatWarning[stat.key] = true;
      }
    });
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
        if (!key || !key.startsWith('map_') || itemsContains[key]) {
          return;
        }

        itemsContains[key] = true;

        const localStat = stat.text[this.language];
        if (localStat) {
          const predicates = Object.getOwnPropertyNames(localStat);
          const predicate = predicates.find(x => (x[0] === 'N' && stat.negated) || !stat.negated);
          const item: SelectListItem = {
            key,
            text: this.statsService.translate(stat, predicate, this.language),
            selected: !!this.settings.inspectMapStatWarning[key],
          };
          items.push(item);
        } else {
          console.warn(`Stat with ${tradeId} not found in ${this.language}.`);
        }
      });
    });
    this.stats$.next(items);
  }
}
