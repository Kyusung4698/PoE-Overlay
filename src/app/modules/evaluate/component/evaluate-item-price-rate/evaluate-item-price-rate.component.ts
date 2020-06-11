import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { Item, ItemRarity } from '@shared/module/poe/item';
import { ItemPriceRateResult, ItemPriceRateService } from '@shared/module/poe/price';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { catchError, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EvaluateItemOptions } from '../evaluate-item-options/evaluate-item-options.component';

interface Message {
  key: string;
  value?: any;
}

@Component({
  selector: 'app-evaluate-item-price-rate',
  templateUrl: './evaluate-item-price-rate.component.html',
  styleUrls: ['./evaluate-item-price-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPriceRateComponent implements OnInit, OnDestroy {
  private currenciesChange = new Subject<string[]>();

  public rate$: Observable<ItemPriceRateResult>;

  public inverse$ = new BehaviorSubject<boolean>(false);
  public loading$ = new BehaviorSubject<boolean>(false);
  public message$ = new BehaviorSubject<Message>(undefined);
  public error$ = new BehaviorSubject<Message>(undefined);

  @Input()
  public item: Item;

  @Input()
  public currencies: string[];

  @Input()
  public options: EvaluateItemOptions;

  @Input()
  public optionsChange: Subject<EvaluateItemOptions>;

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  constructor(private readonly price: ItemPriceRateService) { }

  public ngOnInit(): void {
    this.rate$ = this.optionsChange.pipe(
      startWith(this.options),
      tap(() => this.clear()),
      tap(() => this.loading$.next(true)),
      switchMap(options => this.currenciesChange.pipe(
        startWith(this.currencies),
        switchMap(currencies => this.price.get(this.item, currencies, options.leagueId).pipe(
          takeUntil(merge(this.optionsChange, this.currenciesChange)),
          catchError(error => this.handleError(error, {
            item: this.item,
            currencies,
            options
          }))
        ))
      )),
      tap(rate => this.message$.next(!rate ? {
        key: 'trade.not-found'
      } : undefined)),
      tap(rate => this.updateInverse(rate)),
      tap(() => this.loading$.next(false))
    );
  }

  public ngOnDestroy(): void {
    this.inverse$.complete();
    this.loading$.complete();
    this.message$.complete();
    this.error$.complete();
  }

  public onInverseToggle(): void {
    this.toggleInverse();
  }

  public onRateBrowse(rate: ItemPriceRateResult, external: boolean): void {
    if (rate.url?.length) {
      OWUtils.openUrl(rate.url, external);
    }
  }

  public onWheel(event: WheelEvent, currency: string): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const index = this.currencies.findIndex(x => x === currency) + factor;
    if (index >= this.currencies.length) {
      this.currenciesChange.next([this.currencies[0]]);
    } else if (index < 0) {
      this.currenciesChange.next([this.currencies[this.currencies.length - 1]]);
    } else {
      this.currenciesChange.next([this.currencies[index]]);
    }
  }

  private toggleInverse(): void {
    this.inverse$.next(!this.inverse$.value);
  }

  private updateInverse(rate: ItemPriceRateResult): void {
    if (rate) {
      const { amount, factor } = rate;
      const inverse = amount < 1 && factor <= 1 && this.item.rarity === ItemRarity.Currency;
      this.inverse$.next(inverse);
    }
  }

  private clear(): void {
    this.message$.next(undefined);
    this.error$.next(undefined);
  }

  private handleError(error: any, context: any): Observable<any> {
    if (typeof error === 'string') {
      console.log('An error occured while rating item.', error, context);
      this.error$.next({
        key: error
      });
    } else if (error && error.status) {
      switch (error.status) {
        default:
          console.warn('An http error occured while rating item.', error, context);
          this.error$.next({
            key: 'evaluate.rate.errors.http'
          });
          break;
      }
    } else {
      this.error$.next({
        key: 'evaluate.rate.error'
      });
      console.error('An unexpected error occured while rating item.', error, context);
    }
    return of(null);
  }
}
