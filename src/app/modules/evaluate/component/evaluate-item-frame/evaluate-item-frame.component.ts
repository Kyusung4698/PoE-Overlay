import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Language } from '@data/poe/schema';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { EvaluateFeatureSettings } from '@modules/evaluate/evaluate-feature-settings';
import { EvaluateQueryItemProvider } from '@modules/evaluate/provider';
import { Item } from '@shared/module/poe/item';
import { Subject } from 'rxjs';
import { EvaluateItemOptions } from '../evaluate-item-options/evaluate-item-options.component';

@Component({
  selector: 'app-evaluate-item-frame',
  templateUrl: './evaluate-item-frame.component.html',
  styleUrls: ['./evaluate-item-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemFrameComponent implements OnInit, OnDestroy {
  public options: EvaluateItemOptions;
  public optionsChange = new Subject<EvaluateItemOptions>();

  public defaultItem: Item;

  public queryItem: Item;
  public queryItemChange = new Subject<Item>();

  public currencies: string[];

  @Input()
  public item: Item;

  @Input()
  public language: Language;

  @Input()
  public settings: EvaluateFeatureSettings;

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  constructor(private readonly queryItemProvider: EvaluateQueryItemProvider) { }

  public ngOnInit(): void {
    this.options = {
      fetchCount: this.settings.evaluateItemSearchQueryFetchCount,
      indexed: this.settings.evaluateItemSearchFilterIndexed,
      online: this.settings.evaluateItemSearchFilterOnlineOnly,
      leagueId: this.settings.leagueId
    };
    const { defaultItem, queryItem } = this.queryItemProvider.provide(this.item, this.settings);
    this.defaultItem = defaultItem;
    this.queryItem = queryItem;
    this.currencies = this.settings.evaluateCurrencies;
  }

  public ngOnDestroy(): void {
    this.queryItemChange.complete();
  }

  public onQueryItemChange(queryItem: Item): void {
    this.setQueryItem(queryItem);
  }

  public onOptionsChange(options: EvaluateItemOptions): void {
    this.setOptions(options);
  }

  public onReset(): void {
    const queryItem = JSON.parse(JSON.stringify(this.defaultItem));
    this.setQueryItem(queryItem);
  }

  private setOptions(options: EvaluateItemOptions): void {
    this.options = options;
    this.optionsChange.next(this.options);
  }

  private setQueryItem(queryItem: Item): void {
    this.queryItem = queryItem;
    this.queryItemChange.next(queryItem);
  }
}
