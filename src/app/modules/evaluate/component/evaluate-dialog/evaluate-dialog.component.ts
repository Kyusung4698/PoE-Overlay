import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EvaluateQueryItemProvider } from '@modules/evaluate/provider/evaluate-query-item.provider';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Item, Language } from '@shared/module/poe/type';
import { forkJoin, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

export interface EvaluateDialogData {
  item: Item;
  settings: EvaluateUserSettings;
  language?: Language;
}

const CURRENCIES_CACHE_SIZE = 1;

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit, AfterViewInit {
  private init = false;

  public defaultItem: Item;
  public queryItem: Item;
  public queryItemChange: Subject<Item>;
  public currencies$: Observable<Currency[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EvaluateDialogData,
    private readonly evaluateQueryItemProvider: EvaluateQueryItemProvider,
    private readonly currencyService: CurrencyService) {
  }

  public ngOnInit(): void {
    const { defaultItem, queryItem } = this.evaluateQueryItemProvider.provide(this.data.item, this.data.settings);
    this.defaultItem = defaultItem;
    this.queryItem = queryItem;
    this.queryItemChange = new Subject<Item>();
    this.currencies$ = this.getCurrencies();
  }

  public ngAfterViewInit(): void {
    this.init = true;
  }

  public onQueryItemChange(queryItem: Item): void {
    if (this.init) {
      this.queryItem = queryItem;
      this.queryItemChange.next(queryItem);
    }
  }

  private getCurrencies(): Observable<Currency[]> {
    const currencies$ = this.data.settings.evaluateCurrencyIds.map(id => this.currencyService.searchById(id));
    return forkJoin(currencies$).pipe(
      shareReplay(CURRENCIES_CACHE_SIZE)
    );
  }
}
