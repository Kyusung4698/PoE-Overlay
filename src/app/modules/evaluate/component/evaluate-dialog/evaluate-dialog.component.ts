import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchEvaluateService, ItemSearchService } from '@shared/module/poe/service';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Item, ItemSearchEvaluateResult, Language } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, flatMap, switchMap, takeUntil } from 'rxjs/operators';

export interface EvaluateDialogData {
  item: Item;
  currencyId: string;
  language?: Language;
}

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit {
  private queryItemChange: Subject<Item>;
  public queryItem: Item;

  public result$ = new BehaviorSubject<ItemSearchEvaluateResult>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EvaluateDialogData,
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchEvaluateService,
    private readonly currencyService: CurrencyService,
    private readonly window: WindowService,
    private readonly snackbar: SnackBarService) {
  }

  public ngOnInit(): void {
    this.initQueryItem();
    this.firstSearch();
    this.registerSearchOnChange();
  }

  public onQueryItemChange(queryItem: Item): void {
    this.queryItemChange.next(queryItem);
  }

  public onCurrencyClick(): void {
    const result = this.result$.getValue();
    if (result && result.url) {
      this.window.open(result.url);
    }
  }

  private initQueryItem(): void {
    const item = this.data.item;
    this.queryItem = {
      nameId: item.nameId,
      typeId: item.typeId,
      rarity: item.rarity,
      explicits: (item.explicits || []).map(x => []),
      implicits: [],
      properties: {},
      requirements: {},
      sockets: []
    };
    this.queryItemChange = new Subject<Item>();
  }

  private firstSearch(): void {
    this.search(this.queryItem).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
  }

  private registerSearchOnChange(): void {
    this.queryItemChange.pipe(
      debounceTime(500),
      switchMap(queryItem => {
        this.result$.next(null);
        return this.search(queryItem).pipe(
          takeUntil(this.queryItemChange)
        );
      })
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
  }

  private search(item: Item): Observable<ItemSearchEvaluateResult> {
    return forkJoin(
      this.itemSearchService.search(item),
      this.currencyService.searchById(this.data.currencyId)
    ).pipe(
      flatMap(results => {
        if (results[0].items.length <= 0) {
          const empty: ItemSearchEvaluateResult = {
            url: results[0].url,
            items: [],
            targetCurrency: null,
            targetCurrencyAvg: null
          };
          return of(empty);
        }
        return this.itemSearchEvaluateService.evaluate(results[0], results[1]);
      })
    );
  }

  private handleError(error: any): void {
    this.result$.next({
      url: null,
      items: null
    });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'An unexpected error occured while searching for the item.'}`);
  }
}
