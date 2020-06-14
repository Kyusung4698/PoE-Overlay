import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EnumValues } from '@app/enum';
import { FeatureSettingsComponent } from '@app/feature';
import { Language } from '@data/poe/schema';
import { EvaluateFeatureSettings, EvaluateItemSearchLayout, EVALUATE_QUERY_DEBOUNCE_TIME_MAX, EVALUATE_QUERY_FETCH_COUNT_MAX } from '@modules/evaluate/evaluate-feature-settings';
import { SelectListItem } from '@shared/module/material/component';
import { CurrenciesService, Currency } from '@shared/module/poe/currency';
import { PSEUDO_MODIFIERS } from '@shared/module/poe/item/processor/item-pseudo-processor.config';
import { StatsProvider, StatsService, StatType } from '@shared/module/poe/item/stat';
import { BehaviorSubject } from 'rxjs';

interface StatSelectListItem extends SelectListItem {
  type: string;
}

@Component({
  selector: 'app-evaluate-settings',
  templateUrl: './evaluate-settings.component.html',
  styleUrls: ['./evaluate-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSettingsComponent extends FeatureSettingsComponent<EvaluateFeatureSettings> {
  private language: Language;

  public languages = new EnumValues(Language);
  public layouts = new EnumValues(EvaluateItemSearchLayout);

  public currencies$ = new BehaviorSubject<Currency[]>([]);
  public stats$ = new BehaviorSubject<StatSelectListItem[]>([]);

  public debounceTimeMax = EVALUATE_QUERY_DEBOUNCE_TIME_MAX;
  public fetchCountMax = EVALUATE_QUERY_FETCH_COUNT_MAX;

  public displayWithTime = (value: number) => value === this.debounceTimeMax ? '∞' : `${Math.round(value * 10) / 100}s`;
  public displayWithCount = (value: number) => `${value} items`;
  public displayWithStat = (value: number) => value === 50 ? '#' : value;

  constructor(
    private readonly currencies: CurrenciesService,
    private readonly statsProvider: StatsProvider,
    private readonly statsService: StatsService) {
    super();
  }

  public load(): void {
    const { language } = this.settings;
    if (language && this.language !== language) {
      this.language = language;
      this.updateCurrencies();
      this.updateStats();
    }
  }

  public onChange(): void {
    this.save();
  }

  public onStatsChange(stats: StatSelectListItem[]): void {
    this.settings.evaluateItemSearchStats = {};
    stats.forEach(stat => {
      if (stat.selected) {
        this.settings.evaluateItemSearchStats[stat.key] = true;
      }
    });
    this.save();
  }

  public onCurrenciesValueChange(): void {
    if (!this.settings.evaluateCurrencies.length) {
      this.settings.evaluateCurrencies = ['chaos', 'exa'];
    }
    this.save();
  }

  private updateStats(): void {
    const items: StatSelectListItem[] = [];

    const pseudos = this.statsProvider.provide(StatType.Pseudo);
    Object.getOwnPropertyNames(pseudos).forEach(tradeId => {
      const pseudo = pseudos[tradeId];
      if (PSEUDO_MODIFIERS[tradeId]) {
        const predicate = Object.getOwnPropertyNames(pseudo.text[this.language])[0];
        const key = `${StatType.Pseudo}.${tradeId}`;
        const item: StatSelectListItem = {
          key,
          type: StatType.Pseudo,
          text: this.statsService.translate(pseudo, predicate, this.language),
          selected: !!this.settings.evaluateItemSearchStats[key],
        };
        items.push(item);
      }
    });

    const types = [StatType.Explicit, StatType.Implicit, StatType.Crafted, StatType.Enchant, StatType.Fractured];
    types.forEach(type => {
      const stats = this.statsProvider.provide(type);
      Object.getOwnPropertyNames(stats).forEach(tradeId => {
        const stat = stats[tradeId];
        const localStat = stat.text[this.language];
        if (localStat) {
          const predicate = Object.getOwnPropertyNames(localStat)[0];
          const key = `${type}.${tradeId}`;
          const item: StatSelectListItem = {
            key,
            type,
            text: this.statsService.translate(stat, predicate, this.language),
            selected: !!this.settings.evaluateItemSearchStats[key],
          };
          items.push(item);
        } else {
          console.warn(`Stat with ${tradeId} not found in ${this.language}.`);
        }
      });
    });
    this.stats$.next(items);
  }

  private updateCurrencies(): void {
    this.currencies.get(this.language).subscribe(currencies => {
      if (this.settings.evaluateCurrencies) {
        this.settings.evaluateCurrencies = this.settings.evaluateCurrencies.filter(id => currencies.find(currency => currency.id === id));
        if (this.settings.evaluateCurrencies.length <= 0) {
          this.settings.evaluateCurrencies = [currencies[0].id];
        }
      }
      this.currencies$.next(currencies);
    });
  }
}
