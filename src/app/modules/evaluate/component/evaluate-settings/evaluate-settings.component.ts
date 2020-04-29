import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnumValues } from '@app/class';
import { ClipboardService } from '@app/service/input';
import { SelectListItem } from '@shared/module/material/component/select-list/select-list.component';
import { SnackBarService } from '@shared/module/material/service';
import { PSEUDO_MODIFIERS } from '@shared/module/poe/config/pseudo.config';
import { StatsProvider } from '@shared/module/poe/provider/stats.provider';
import { StatsService } from '@shared/module/poe/service';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Language, StatType } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export enum EvaluateResultView {
  Graph = 1,
  List = 2,
}

export enum EvaluatePricing {
  Clipboard = 1,
  Tagging = 2
}

export interface EvaluateUserSettings extends UserSettings {
  evaluateCurrencyOriginal: boolean;
  evaluateCurrencyIds: string[];
  evaluateKeybinding: string;
  evaluateResultView: EvaluateResultView;
  evaluateTranslatedItemLanguage: Language;
  evaluateTranslatedKeybinding: string;
  evaluateQueryDefaultItemLevel: boolean;
  evaluateQueryDefaultLinks: number;
  evaluateQueryDefaultMiscs: boolean;
  evaluateQueryDefaultType: boolean;
  evaluateQueryDefaultAttack: boolean;
  evaluateQueryDefaultDefense: boolean;
  evaluateQueryNormalizeQuality: boolean;
  evaluatePropertyMinRange: number;
  evaluatePropertyMaxRange: number;
  evaluateQueryDefaultStats: any;
  evaluateQueryDefaultStatsUnique: boolean;
  evaluateQueryOnline: boolean;
  evaluateQueryIndexedRange: ItemSearchIndexed;
  evaluateModifierMinRange: number;
  evaluateModifierMaxRange: number;
  evaluateQueryDebounceTime: number;
  evaluateQueryFetchCount: number;
  evaluatePricing: EvaluatePricing;
}

export const EVALUATE_QUERY_DEBOUNCE_TIME_MAX = 100;
export const EVALUATE_QUERY_FETCH_COUNT_MAX = 100;

interface StatSelectListItem extends SelectListItem {
  type: string;
}

@Component({
  selector: 'app-evaluate-settings',
  templateUrl: './evaluate-settings.component.html',
  styleUrls: ['./evaluate-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSettingsComponent implements UserSettingsComponent {
  public languages = new EnumValues(Language);
  public views = new EnumValues(EvaluateResultView);
  public pricings = new EnumValues(EvaluatePricing);

  @Input()
  public settings: EvaluateUserSettings;

  public currencies$ = new BehaviorSubject<Currency[]>([]);
  public stats$ = new BehaviorSubject<StatSelectListItem[]>([]);

  public debounceTimeMax = EVALUATE_QUERY_DEBOUNCE_TIME_MAX;
  public fetchCountMax = EVALUATE_QUERY_FETCH_COUNT_MAX;

  public displayWithTime = (value: number) => value === this.debounceTimeMax ? '∞' : `${Math.round(value * 10) / 100}s`;
  public displayWithCount = (value: number) => `${value} items`;
  public displayWithStat = (value: number) => value === 50 ? '#' : value;

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly statsProvider: StatsProvider,
    private readonly statsService: StatsService,
    private readonly clipboard: ClipboardService,
    private readonly snackbar: SnackBarService) { }

  public load(): void {
    if (this.settings.language) {
      this.updateCurrencies();
      this.updateStats();
    }
  }

  public onStatsChange(stats: StatSelectListItem[]): void {
    this.settings.evaluateQueryDefaultStats = {};
    stats.forEach(stat => {
      if (stat.selected) {
        this.settings.evaluateQueryDefaultStats[stat.key] = true;
      }
    });
  }

  public onCurrenciesValueChange(): void {
    if (this.settings.evaluateCurrencyIds.length <= 0) {
      this.settings.evaluateCurrencyIds = ['chaos', 'exa'];
    }
  }

  public onExportStats(): void {
    try {
      const stats = JSON.stringify(this.settings.evaluateQueryDefaultStats, null, '\t');
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
    this.settings.evaluateQueryDefaultStats = stats;
    this.updateStats();
    this.snackbar.success('stats were imported successfully.');
  }

  private updateStats(): void {
    const items: StatSelectListItem[] = [];

    const pseudos = this.statsProvider.provide(StatType.Pseudo);
    Object.getOwnPropertyNames(pseudos).forEach(tradeId => {
      const pseudo = pseudos[tradeId];
      if (PSEUDO_MODIFIERS[tradeId]) {
        const predicate = Object.getOwnPropertyNames(pseudo.text[this.settings.language])[0];
        const key = `${StatType.Pseudo}.${tradeId}`;
        const item: StatSelectListItem = {
          key,
          type: StatType.Pseudo,
          text: this.statsService.translate(pseudo, predicate, this.settings.language),
          selected: !!this.settings.evaluateQueryDefaultStats[key],
        };
        items.push(item);
      }
    });

    const types = [StatType.Explicit, StatType.Implicit, StatType.Crafted, StatType.Enchant, StatType.Fractured];
    types.forEach(type => {
      const stats = this.statsProvider.provide(type);
      Object.getOwnPropertyNames(stats).forEach(tradeId => {
        const stat = stats[tradeId];
        const localStat = stat.text[this.settings.language];
        if (localStat) {
          const predicate = Object.getOwnPropertyNames(localStat)[0];
          const key = `${type}.${tradeId}`;
          const item: StatSelectListItem = {
            key,
            type,
            text: this.statsService.translate(stat, predicate, this.settings.language),
            selected: !!this.settings.evaluateQueryDefaultStats[key],
          };
          items.push(item);
        } else {
          console.warn(`Stat with ${tradeId} not found in ${this.settings.language}.`);
        }
      });
    });
    this.stats$.next(items);
  }

  private updateCurrencies(): void {
    this.currencyService.get(this.settings.language).subscribe(currencies => {
      if (this.settings.evaluateCurrencyIds) {
        this.settings.evaluateCurrencyIds = this.settings.evaluateCurrencyIds.filter(id => currencies.find(currency => currency.id === id));
        if (this.settings.evaluateCurrencyIds.length <= 0) {
          this.settings.evaluateCurrencyIds = [currencies[0].id];
        }
      }
      this.currencies$.next(currencies);
    });
  }

}
