import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserService } from '@app/service';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchEvaluateService, ItemSearchService } from '@shared/module/poe/service';
import { Currency, Item, ItemSearchEvaluateResult } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, flatMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

const SEARCH_DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-evaluate-search',
  templateUrl: './evaluate-search.component.html',
  styleUrls: ['./evaluate-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSearchComponent implements OnInit {
  public options$ = new BehaviorSubject<boolean>(false);
  public online$: BehaviorSubject<boolean>;
  public indexed$: BehaviorSubject<ItemSearchIndexed>;

  public result$ = new BehaviorSubject<ItemSearchEvaluateResult>(null);

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
  public evaluate = new EventEmitter<EvaluateResult>();

  constructor(
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchEvaluateService,
    private readonly browser: BrowserService,
    private readonly snackbar: SnackBarService) { }

  public ngOnInit() {
    this.online$ = new BehaviorSubject(this.settings.evaluateQueryOnline);
    this.indexed$ = new BehaviorSubject(this.settings.evaluateQueryIndexedRange);
    this.search(this.queryItem).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
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

  public onAmountSelect(amount: number): void {
    const currency = this.result$.value.currency;
    this.evaluate.next({ amount, currency });
  }

  private registerSearchOnChange(): void {
    this.queryItemChange.pipe(
      debounceTime(SEARCH_DEBOUNCE_TIME),
      tap(() => this.result$.next(null)),
      switchMap(queryItem => this.search(queryItem).pipe(
        takeUntil(this.queryItemChange)
      ))
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
  }

  private search(item: Item): Observable<ItemSearchEvaluateResult> {
    return this.itemSearchService.search(item, {
      indexed: this.indexed$.value,
      online: this.online$.value,
    }).pipe(
      flatMap(searchResult => {
        if (searchResult.items.length <= 0) {
          const empty: ItemSearchEvaluateResult = {
            url: searchResult.url,
            items: [],
            total: 0,
          };
          return of(empty);
        }
        return this.itemSearchEvaluateService.evaluate(searchResult, this.currencies);
      })
    );
  }

  private handleError(error: any): void {
    this.result$.next({
      url: null,
      items: null,
      total: null
    });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'An unexpected error occured while searching for the item.'}`);
  }
}
