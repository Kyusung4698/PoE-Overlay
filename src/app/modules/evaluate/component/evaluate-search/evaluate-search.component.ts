import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserService } from '@app/service';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchAnalyzeResult, ItemSearchAnalyzeService, ItemSearchListing, ItemSearchResult, ItemSearchService } from '@shared/module/poe/service';
import { Currency, Item } from '@shared/module/poe/type';
import { ItemSearchIndexed, ItemSearchOptions } from '@shared/module/poe/type/search.type';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { EvaluateResultView, EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

@Component({
  selector: 'app-evaluate-search',
  templateUrl: './evaluate-search.component.html',
  styleUrls: ['./evaluate-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSearchComponent implements OnInit {
  private listSubscription: Subscription;

  public options$ = new BehaviorSubject<boolean>(false);
  public online$: BehaviorSubject<boolean>;
  public indexed$: BehaviorSubject<ItemSearchIndexed>;

  public graph: boolean;

  public search$ = new BehaviorSubject<ItemSearchResult>(null);
  public listings$ = new BehaviorSubject<ItemSearchListing[]>(null);
  public result$ = new BehaviorSubject<ItemSearchAnalyzeResult>(null);
  public error$ = new BehaviorSubject<boolean>(false);
  public staleCounter$ = new BehaviorSubject<number>(0);

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
    private readonly itemSearchAnalyzeService: ItemSearchAnalyzeService,
    private readonly browser: BrowserService,
    private readonly snackbar: SnackBarService) { }

  public ngOnInit() {
    this.online$ = new BehaviorSubject(this.settings.evaluateQueryOnline);
    this.indexed$ = new BehaviorSubject(this.settings.evaluateQueryIndexedRange);
    this.graph = this.settings.evaluateResultView === EvaluateResultView.Graph;

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
    const search = this.search$.value;
    if (search?.url?.length) {
      this.browser.open(search.url, event.ctrlKey);
    }
  }

  public onSearchCancelClick(): void {
    this.listings$.next([]);
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
  }

  public onStaleCancelClick(): void {
    this.staleCounter$.next(0);
  }

  public onCurrencyWheel(event: WheelEvent): void {
    const listings = this.listings$.value;
    if (!listings?.length) {
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
    this.analyze(listings, this.currencies[index]);
  }

  public onAmountSelect(amount: number, currency?: Currency): void {
    currency = currency || this.result$.value.currency;
    this.evaluateResult.next({ amount, currency });
  }

  private registerSearchOnChange(): void {
    let subscription: Subscription;
    this.queryItemChange.pipe(
      debounceTime(100),
    ).subscribe(item => {
      this.clear();
      this.staleCounter$.next(this.settings.evaluateDebounceTime);
      subscription?.unsubscribe();
      subscription = timer(0, 100).pipe(
        takeUntil(this.queryItemChange),
      ).subscribe(() => {
        if (this.staleCounter$.value === 0) {
          subscription?.unsubscribe();
          this.search(item);
        } else {
          this.staleCounter$.next(this.staleCounter$.value - 1)
        }
      });
    });
  }

  private search(item: Item): void {
    const options: ItemSearchOptions = {
      indexed: this.indexed$.value,
      online: this.online$.value,
    };
    this.itemSearchService.search(item, options).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(search => {
      this.search$.next(search);
      if (search.total > 0) {
        this.list(search);
      }
    }, error => this.handleError(error));
  }

  private list(search: ItemSearchResult): void {
    this.listSubscription = this.itemSearchService.list(search).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(listings => {
      this.listings$.next(listings);
      if (listings.length > 0) {
        this.analyze(listings);
      }
    }, error => this.handleError(error));
  }

  private analyze(listings: ItemSearchListing[], currency?: Currency): void {
    const currencies = currency ? [currency] : this.currencies;
    this.itemSearchAnalyzeService.analyze(listings, currencies).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(
      result => this.result$.next(result),
      error => this.handleError(error));
  }

  private clear(): void {
    this.error$.next(false);
    this.search$.next(null);
    this.listings$.next(null);
    this.result$.next(null);
  }

  private handleError(error: any): void {
    this.clear();
    this.error$.next(true);
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'evaluate.error'}`);
  }
}
