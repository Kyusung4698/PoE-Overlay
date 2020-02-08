import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserService } from '@app/service';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchAnalyzeResult, ItemSearchAnalyzeService, ItemSearchResult, ItemSearchService } from '@shared/module/poe/service';
import { Currency, Item } from '@shared/module/poe/type';
import { ItemSearchIndexed, ItemSearchOptions } from '@shared/module/poe/type/search.type';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

const SEARCH_DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-evaluate-search',
  templateUrl: './evaluate-search.component.html',
  styleUrls: ['./evaluate-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSearchComponent implements OnInit {
  private search$ = new BehaviorSubject<ItemSearchResult>(null);

  public options$ = new BehaviorSubject<boolean>(false);
  public online$: BehaviorSubject<boolean>;
  public indexed$: BehaviorSubject<ItemSearchIndexed>;

  public chart = true;

  public result$ = new BehaviorSubject<ItemSearchAnalyzeResult>(null);

  @Input()
  public settings: EvaluateUserSettings;

  @Input()
  public defaultItem: Item;

  @Input()
  public queryItem: Item;

  @Input()
  public queryItemChange: Subject<Item>;

  @Input()
  public currencies: Currency[];

  @Output()
  public update = new EventEmitter<Item>();

  @Output()
  public evaluateResult = new EventEmitter<EvaluateResult>();

  constructor(
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchAnalyzeService,
    private readonly browser: BrowserService,
    private readonly snackbar: SnackBarService) { }

  public ngOnInit() {
    this.online$ = new BehaviorSubject(this.settings.evaluateQueryOnline);
    this.indexed$ = new BehaviorSubject(this.settings.evaluateQueryIndexedRange);

    this.search(this.queryItem);
    this.registerSearchOnChange();
  }

  public onToggleOnlineClick(): void {
    this.online$.next(!this.online$.value);
    this.update.next(this.queryItem);
  }

  public onResetClick(): void {
    const queryItem = JSON.parse(JSON.stringify(this.defaultItem));
    this.update.next(queryItem);
  }

  public onIndexedWheel(event: WheelEvent): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const keys = Object.getOwnPropertyNames(ItemSearchIndexed);
    let index = keys.findIndex(x => ItemSearchIndexed[x] === this.indexed$.value);
    index += factor;
    if (index >= keys.length) {
      index = 0;
    } else if (index < 0) {
      index = keys.length - 1;
    }
    const key = keys[index];
    this.indexed$.next(ItemSearchIndexed[key]);
    this.update.next(this.queryItem);
  }

  public onCurrencyClick(event: MouseEvent): void {
    const result = this.result$.getValue();
    if (result && result.url) {
      this.browser.open(result.url, event.ctrlKey);
    }
  }

  public onCurrencyWheel(event: WheelEvent): void {
    if (!this.search$.value || !this.result$.value) {
      return;
    }

    const factor = event.deltaY > 0 ? -1 : 1;
    let index = this.currencies.findIndex(x => x.id === this.result$.value.currency.id);
    index += factor;
    if (index >= this.currencies.length) {
      index = 0;
    } else if (index < 0) {
      index = this.currencies.length - 1;
    }
    this.result$.next(null);
    this.evaluate(this.search$.value, this.currencies[index]);
  }

  public onAmountSelect(amount: number): void {
    const currency = this.result$.value.currency;
    this.evaluateResult.next({ amount, currency });
  }

  private registerSearchOnChange(): void {
    this.queryItemChange.pipe(
      debounceTime(SEARCH_DEBOUNCE_TIME),
      tap(() => this.result$.next(null)),
    ).subscribe(item => this.search(item));
  }

  private search(item: Item): void {
    const options: ItemSearchOptions = {
      indexed: this.indexed$.value,
      online: this.online$.value,
    };
    this.itemSearchService.search(item, options).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(
      search => {
        this.search$.next(search);
        this.evaluate(search);
      },
      error => this.handleError(error)
    );
  }

  private evaluate(search: ItemSearchResult, currency?: Currency): void {
    if (search.items.length <= 0) {
      const empty: ItemSearchAnalyzeResult = {
        url: search.url,
        items: [],
        total: 0,
      };
      this.result$.next(empty);
    } else {
      this.itemSearchEvaluateService
        .analyze(search, currency ? [currency] : this.currencies)
        .subscribe(
          result => this.result$.next(result),
          error => this.handleError(error)
        );
    }
  }

  private handleError(error: any): void {
    this.result$.next({
      url: null,
      items: null,
      total: null
    });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'evaluate.error'}`);
  }
}
