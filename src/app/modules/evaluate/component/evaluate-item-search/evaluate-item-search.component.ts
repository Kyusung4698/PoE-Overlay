import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { EvaluateFeatureSettings, EvaluateItemSearchLayout, EVALUATE_QUERY_DEBOUNCE_TIME_FACTOR, EVALUATE_QUERY_DEBOUNCE_TIME_MAX } from '@modules/evaluate/evaluate-feature-settings';
import { Item } from '@shared/module/poe/item';
import { TradeFetchAnalyzeResult, TradeFetchAnalyzeService, TradeFetchService, TradeSearchRequestService, TradeSearchService } from '@shared/module/poe/trade';
import { BehaviorSubject, merge, Observable, of, Subject, timer } from 'rxjs';
import { catchError, debounceTime, map, mergeMap, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EvaluateItemOptions } from '../evaluate-item-options/evaluate-item-options.component';

interface Message {
  key: string;
  value?: any;
}

@Component({
  selector: 'app-evaluate-item-search',
  templateUrl: './evaluate-item-search.component.html',
  styleUrls: ['./evaluate-item-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemSearchComponent implements OnInit, OnDestroy {
  private currenciesChange = new Subject<string[]>();

  public analyze$: Observable<TradeFetchAnalyzeResult>;

  public loading$ = new BehaviorSubject<boolean>(false);
  public message$ = new BehaviorSubject<Message>(undefined);
  public error$ = new BehaviorSubject<Message>(undefined);

  public timer$ = new BehaviorSubject<Observable<number>>(undefined);

  @Input()
  public settings: EvaluateFeatureSettings;

  @Input()
  public currencies: string[];

  @Input()
  public graph: boolean;

  @Input()
  public queryItem: Item;

  @Input()
  public queryItemChange: Subject<Item>;

  @Input()
  public options: EvaluateItemOptions;

  @Input()
  public optionsChange: Subject<EvaluateItemOptions>;

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  constructor(
    private readonly request: TradeSearchRequestService,
    private readonly search: TradeSearchService,
    private readonly fetch: TradeFetchService,
    private readonly analyze: TradeFetchAnalyzeService) { }

  public ngOnInit(): void {
    this.graph = this.settings.evaluateItemSearchLayout === EvaluateItemSearchLayout.Graph;
    if (this.settings.evaluateItemSearchQueryInitial) {
      this.initSearch();
    }
  }

  public ngOnDestroy(): void {
    this.loading$?.complete();
    this.message$?.complete();
    this.error$?.complete();
  }

  public onSearch(): void {
    this.stopTimer();
    this.initSearch();
  }

  public onCurrencySelect(currency: string): void {
    this.currenciesChange.next([currency]);
  }

  public onSearchBrowse(analyze: TradeFetchAnalyzeResult, external: boolean): void {
    if (analyze?.url?.length) {
      OWUtils.openUrl(analyze.url, external);
    }
  }

  private clear(): void {
    this.message$.next(undefined);
    this.error$.next(undefined);
  }

  private setMessage(key: string, value?: any): void {
    this.message$.next({ key, value });
  }

  private startTimer(): void {
    const interval = EVALUATE_QUERY_DEBOUNCE_TIME_FACTOR * 5;
    this.timer$.next(
      timer(0, interval).pipe(
        map((_, index) => {
          if (this.settings.evaluateItemSearchQueryDebounceTime === EVALUATE_QUERY_DEBOUNCE_TIME_MAX) {
            return 100;
          }
          const max = this.settings.evaluateItemSearchQueryDebounceTime * EVALUATE_QUERY_DEBOUNCE_TIME_FACTOR;
          const now = index * interval;
          return Math.max(max - now, 0) / max * 100;
        })
      )
    );
  }

  private stopTimer(): void {
    this.timer$.next(undefined);
  }

  private initSearch(): void {
    this.analyze$ = this.queryItemChange.pipe(
      tap(() => this.startTimer()),
      debounceTime(this.settings.evaluateItemSearchQueryDebounceTime * EVALUATE_QUERY_DEBOUNCE_TIME_FACTOR),
      tap(() => this.stopTimer()),
      startWith(this.queryItem),
      switchMap(item => {
        return this.optionsChange.pipe(
          startWith(this.options),
          tap(() => this.clear()),
          tap(() => this.loading$.next(true)),
          switchMap(options => {
            const request = this.request.get(item, { ...options });
            return of(null).pipe(
              tap(() => this.setMessage('trade.searching')),
              mergeMap(() => this.search.search(request).pipe(
                takeUntil(merge(this.queryItemChange, this.optionsChange))
              )),
              tap(search => this.setMessage('trade.fetching', {
                total: search.total,
                count: Math.min(search.ids.length, options.fetchCount)
              })),
              mergeMap(search => this.fetch.fetch(search, 0, options.fetchCount).pipe(
                takeUntil(merge(this.queryItemChange, this.optionsChange))
              )),
              tap(() => this.setMessage('trade.analyzing')),
              mergeMap(fetch => {
                return this.currenciesChange.pipe(
                  startWith(this.currencies),
                  switchMap(currencies => this.analyze.analyze(fetch, currencies).pipe(
                    takeUntil(merge(this.queryItemChange, this.optionsChange, this.currenciesChange))
                  ))
                );
              }),
              catchError(error => this.handleError(error, { item, options }))
            );
          })
        );
      }),
      tap(() => this.loading$.next(false)),
    );
  }

  private handleError(error: any, context: any): Observable<any> {
    if (typeof error === 'string') {
      console.log('An error occured while searching item.', error, context);
      this.error$.next({
        key: error
      });
    } else if (error && error.status) {
      switch (error.status) {
        case 429:
          console.log('An http rate error occured while searching item.', error, context);
          this.error$.next({
            key: 'trade.errors.rate'
          });
          break;
        default:
          console.warn('An http error occured while searching item.', error, context);
          this.error$.next({
            key: 'trade.errors.http'
          });
          break;
      }
    } else {
      this.error$.next({
        key: 'trade.error'
      });
      console.error('An unexpected error occured while searching item.', error, context);
    }
    return of(null);
  }
}
