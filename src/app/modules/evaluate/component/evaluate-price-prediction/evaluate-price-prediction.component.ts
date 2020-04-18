import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { LoggerService } from '@app/service';
import { ItemPricePredictionFeedback, ItemPricePredictionResult, ItemPricePredictionService } from '@shared/module/poe/service';
import { Currency, Item, Language } from '@shared/module/poe/type';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { EvaluateOptions } from '../evaluate-options/evaluate-options.component';

@Component({
  selector: 'app-evaluate-price-prediction',
  templateUrl: './evaluate-price-prediction.component.html',
  styleUrls: ['./evaluate-price-prediction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluatePricePredictionComponent implements OnInit {
  private _currencies: Currency[];

  public result$ = new BehaviorSubject<ItemPricePredictionResult>(undefined);
  public error$ = new BehaviorSubject<string>(undefined);

  public feedback$: BehaviorSubject<boolean>;

  @Input()
  public language: Language;

  @Input()
  public options: EvaluateOptions;

  @Input()
  public optionsChange: Subject<EvaluateOptions>;

  @Input()
  public item: Item;

  @Input()
  public set currencies(currencies: Currency[]) {
    this._currencies = currencies;
    this.predict(this.item);
  }

  public get currencies(): Currency[] {
    return this._currencies;
  }

  constructor(
    private readonly prediction: ItemPricePredictionService,
    private readonly logger: LoggerService) { }

  public ngOnInit(): void {
    this.optionsChange.pipe(
      debounceTime(200)
    ).subscribe(() => this.predict(this.item));
  }

  public onFeedback(feedback: string): void {
    const { value } = this.result$;
    if (!value?.id || this.feedback$) {
      return;
    }

    this.feedback$ = new BehaviorSubject<boolean>(undefined);
    this.prediction.feedback(
      value.id, feedback as ItemPricePredictionFeedback
    ).subscribe(
      () => this.feedback$.next(true),
      () => this.feedback$.next(false)
    );
  }

  public onWheel(event: WheelEvent): void {
    if (!this.result$.value || !this.result$.value.currency) {
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

    this.predict(this.item, this.currencies[index]);
  }

  private predict(item: Item, currency?: Currency): void {
    this.clear();
    if (this.language !== Language.English) {
      this.error$.next('evaluate.prediction.language');
    } else {
      const { leagueId } = this.options;
      const currencies = currency ? [currency] : this.currencies;
      this.prediction.predict(item, currencies, leagueId).pipe(
        takeUntil(this.optionsChange)
      ).subscribe(result => {
        this.result$.next(result);
      }, error => this.handleError(error));
    }

  }

  private clear(): void {
    this.error$.next(undefined);
    this.result$.next(undefined);
  }

  private handleError(error: any): void {
    this.clear();
    this.logger.warn(error);
    if (typeof error === 'string') {
      this.error$.next(error);
    } else if (error && error.status) {
      switch (error.status) {
        default:
          this.error$.next('evaluate.prediction.errors.http');
          break;
      }
    } else {
      this.error$.next('evaluate.prediction.error');
    }
  }
}
