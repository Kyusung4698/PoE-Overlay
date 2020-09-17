import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ChatService } from '@shared/module/poe/chat';
import { TradeFetchResultEntry, TradeFetchService } from '@shared/module/poe/trade';
import { TradeExchangeRequest, TradeExchangeResponse, TradeExchangeService } from '@shared/module/poe/trade/exchange';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WhisperEvent } from '../market-exchange-price/market-exchange-price.component';

const DEFAULT_REQUEST = () => {
  const request: TradeExchangeRequest = {
    exchange: {
      status: {
        option: 'online',
      },
      have: [],
      want: []
    }
  };
  return request;
};

const PAGE_SIZE = 20;

interface Message {
  key: string;
  value?: any;
}

interface Result extends TradeExchangeResponse {
  entries: TradeFetchResultEntry[];
}

@Component({
  selector: 'app-market-exchange',
  templateUrl: './market-exchange.component.html',
  styleUrls: ['./market-exchange.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangeComponent implements OnInit, OnDestroy {
  private queue$ = new Subject<void>();

  public request: TradeExchangeRequest = {
    ...DEFAULT_REQUEST()
  };

  public searching$ = new BehaviorSubject<boolean>(false);
  public fetching$ = new BehaviorSubject<boolean>(false);

  public error$ = new BehaviorSubject<Message>(undefined);

  public page$ = new BehaviorSubject<number>(0);
  public result$: Observable<Result>;

  public highlightTerm$ = new BehaviorSubject<string>(undefined);

  @ViewChild('filter')
  public filterTemplate: TemplateRef<any>;

  @Output()
  public toggleFilter = new EventEmitter<TemplateRef<any>>();

  public trackResult = (_: number, result: TradeFetchResultEntry) => result?.id;

  constructor(
    private readonly exchange: TradeExchangeService,
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

  public onHighlight(highlightTerm: string): void {
    this.highlightTerm$.next(highlightTerm);
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

  public onRequestChange(request?: TradeExchangeRequest): void {
    this.request = request || DEFAULT_REQUEST();
    this.initSearch();
    this.clear();
  }

  public onWhisper(whisper: string, event: WhisperEvent): void {
    let copy = whisper.slice();
    copy = copy.replace('{0}', `${event.itemAmount}`);
    copy = copy.replace('{1}', `${event.valueAmount}`);
    this.chat.send(copy);
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
      mergeMap(() => this.exchange.search(this.request).pipe(
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
          mergeMap(page => this.fetch.fetch(search, PAGE_SIZE * page, PAGE_SIZE + PAGE_SIZE * page, true).pipe(
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
