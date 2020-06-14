import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { Item } from '@shared/module/poe/item';
import { ItemPricePredictionFeedback, ItemPricePredictionResult, ItemPricePredictionService } from '@shared/module/poe/price';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EvaluateItemOptions } from '../evaluate-item-options/evaluate-item-options.component';

interface Message {
  key: string;
  value?: any;
}

@Component({
  selector: 'app-evaluate-item-price-prediction',
  templateUrl: './evaluate-item-price-prediction.component.html',
  styleUrls: ['./evaluate-item-price-prediction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPricePredictionComponent implements OnInit, OnDestroy {
  private currenciesChange = new Subject<string[]>();

  public prediction$: Observable<ItemPricePredictionResult>;
  public feedback$: BehaviorSubject<boolean>;

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

  constructor(private readonly prediction: ItemPricePredictionService) { }

  public ngOnInit(): void {
    this.prediction$ = this.optionsChange.pipe(
      debounceTime(200),
      startWith(this.options),
      tap(() => this.clear()),
      tap(() => this.loading$.next(true)),
      switchMap(options => this.currenciesChange.pipe(
        startWith(this.currencies),
        switchMap(currencies => this.prediction.predict(this.item, currencies, options.leagueId).pipe(
          takeUntil(merge(this.optionsChange, this.currenciesChange)),
          catchError(error => this.handleError(error, {
            item: this.item,
            currencies,
            options
          }))
        ))
      )),
      tap(() => this.loading$.next(false))
    );
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
    this.message$.complete();
    this.error$.complete();
  }

  public onSourceClick(event: MouseEvent, url: string): void {
    OWUtils.openUrl(url, event.ctrlKey);
  }

  public onFeedback(prediction: ItemPricePredictionResult, feedback: string): void {
    if (this.feedback$) {
      return;
    }

    this.feedback$ = new BehaviorSubject<boolean>(undefined);
    this.prediction.feedback(
      prediction.id, feedback as ItemPricePredictionFeedback
    ).subscribe(
      () => this.feedback$.next(true),
      () => this.feedback$.next(false)
    );
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

  private clear(): void {
    this.message$.next(undefined);
    this.error$.next(undefined);
  }

  private handleError(error: any, context: any): Observable<any> {
    if (typeof error === 'string') {
      console.log('An error occured while predicting item.', error, context);
      this.error$.next({
        key: error
      });
    } else if (error && error.status) {
      switch (error.status) {
        default:
          console.warn('An http error occured while predicting item.', error, context);
          this.error$.next({
            key: 'evaluate.prediction.errors.http'
          });
          break;
      }
    } else {
      this.error$.next({
        key: 'evaluate.prediction.error'
      });
      console.error('An unexpected error occured while predicting item.', error, context);
    }
    return of(null);
  }
}
