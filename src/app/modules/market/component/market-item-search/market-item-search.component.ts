import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { TradeFetchResultEntry, TradeFetchService, TradeSearchRequest, TradeSearchResponse, TradeSearchService } from '@shared/module/poe/trade';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';

const DEFAULT_REQUEST = () => {
  const request: TradeSearchRequest = {
    sort: {
      price: 'asc',
    },
    query: {
      status: {
        option: 'online',
      },
      filters: {
        trade_filters: {
          filters: {
            sale_type: {
              option: 'priced'
            }
          }
        }
      },
      stats: [
        {
          type: 'and'
        }
      ]
    }
  };
  return request;
};

const PAGE_SIZE = 10;

interface Message {
  key: string;
  value?: any;
}

interface Result extends TradeSearchResponse {
  entries: TradeFetchResultEntry[];
}

@Component({
  selector: 'app-market-item-search',
  templateUrl: './market-item-search.component.html',
  styleUrls: ['./market-item-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchComponent implements OnInit, OnDestroy {
  private queue$ = new Subject<void>();

  public request: TradeSearchRequest = {
    ...DEFAULT_REQUEST()
  };

  public searching$ = new BehaviorSubject<boolean>(false);
  public fetching$ = new BehaviorSubject<boolean>(false);

  public error$ = new BehaviorSubject<Message>(undefined);

  public page$ = new BehaviorSubject<number>(0);
  public result$: Observable<Result>;

  @ViewChild('filter')
  public filterTemplate: TemplateRef<any>;

  @Output()
  public toggleFilter = new EventEmitter<TemplateRef<any>>();

  public trackResult = (_: number, result: TradeFetchResultEntry) => result?.id;

  constructor(
    private readonly search: TradeSearchService,
    private readonly fetch: TradeFetchService,
    private readonly chat: ChatService) { }

  public ngOnInit(): void {
    this.initSearch();
  }

  public ngOnDestroy(): void {
    this.toggleFilter.next(null);
    this.searching$.complete();
    this.fetching$.complete();
    this.error$.complete();
  }

  public onToggle(toggle: boolean): void {
    this.toggleFilter.next(toggle ? this.filterTemplate : undefined);
  }

  public onSearch(): void {
    this.queue$.next();
  }

  public onNext(): void {
    this.page$.next(this.page$.value + 1);
  }

  public onRequestChange(request?: TradeSearchRequest): void {
    this.request = request || DEFAULT_REQUEST();
    this.initSearch();
    this.clear();
  }

  public onWhisper(whisper: string): void {
    this.chat.send(whisper);
  }

  private clear(): void {
    this.error$.next(undefined);
    this.searching$.next(false);
    this.fetching$.next(false);
  }

  private initSearch(): void {
    this.result$ = this.queue$.pipe(
      tap(() => this.clear()),
      tap(() => this.searching$.next(true)),
      mergeMap(() => this.search.search(this.request).pipe(
        takeUntil(this.queue$),
      )),
      tap(() => this.page$.next(0)),
      switchMap(search => {
        const result: Result = {
          ...search,
          entries: []
        };
        return this.page$.pipe(
          tap(() => this.fetching$.next(true)),
          mergeMap(page => this.fetch.fetch(search, PAGE_SIZE * page, PAGE_SIZE + PAGE_SIZE * page).pipe(
            takeUntil(this.queue$)
          )),
          catchError(error => this.handleError(error, {
            request: this.request
          }, { entries: [] })),
          tap(fetch => result.entries.push(...fetch.entries)),
          map(() => result)
        );
      }),
      catchError(error => this.handleError(error, {
        request: this.request
      })),
      tap(() => this.searching$.next(false)),
      tap(() => this.fetching$.next(false)),
    );
  }

  private handleError(error: any, context: any, result?: any): Observable<any> {
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
    return of(result);
  }
}
