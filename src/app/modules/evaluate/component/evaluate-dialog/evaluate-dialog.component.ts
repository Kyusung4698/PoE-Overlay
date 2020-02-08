import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EvaluateQueryItemProvider } from '@modules/evaluate/provider/evaluate-query-item.provider';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Item, Language } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

const CURRENCIES_CACHE_SIZE = 1;

export interface EvaluateDialogData {
  item: Item;
  settings: EvaluateUserSettings;
  language?: Language;
}

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit, AfterViewInit {
  public defaultItem: Item;
  public queryItem: Item;
  public queryItemChange: Subject<Item>;
  public currencies$: Observable<Currency[]>;

  public init$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EvaluateDialogData,
    private readonly ref: MatDialogRef<EvaluateDialogComponent>,
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
    setTimeout(() => {
      this.init$.next(true);
    }, 1);
  }

  public onQueryItemChange(queryItem: Item): void {
    this.queryItem = queryItem;
    this.queryItemChange.next(queryItem);
  }

  public onEvaluateResult(result: EvaluateResult): void {
    this.ref.close(result);
  }

  private getCurrencies(): Observable<Currency[]> {
    const currencies$ = this.data.settings.evaluateCurrencyIds.map(id => this.currencyService.searchById(id));
    return forkJoin(currencies$).pipe(
      shareReplay(CURRENCIES_CACHE_SIZE)
    );
  }
}
