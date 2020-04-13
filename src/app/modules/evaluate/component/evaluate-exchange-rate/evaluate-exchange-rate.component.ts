import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrowserService, LoggerService } from '@app/service';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { SnackBarService } from '@shared/module/material/service';
import { ItemExchangeRateResult, ItemExchangeRateService } from '@shared/module/poe/service';
import { Currency, Item, ItemRarity } from '@shared/module/poe/type';
import { BehaviorSubject, Subject } from 'rxjs';
import { EvaluateOptions } from '../evaluate-options/evaluate-options.component';

interface Result {
  error?: boolean;
  rate?: ItemExchangeRateResult;
}

@Component({
  selector: 'app-evaluate-exchange-rate',
  templateUrl: './evaluate-exchange-rate.component.html',
  styleUrls: ['./evaluate-exchange-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateExchangeRateComponent implements OnInit {
  private _currencies: Currency[];

  public inverse$ = new BehaviorSubject<boolean>(false);
  public result$ = new BehaviorSubject<Result>(null);

  @Input()
  public options: EvaluateOptions;

  @Input()
  public optionsChange: Subject<EvaluateOptions>;

  @Input()
  public item: Item;

  @Input()
  public set currencies(currencies: Currency[]) {
    this._currencies = currencies;
    this.evaluate(this.item);
  }

  public get currencies(): Currency[] {
    return this._currencies;
  }

  @Output()
  public evaluateResult = new EventEmitter<EvaluateResult>();

  constructor(
    private readonly exchangeRate: ItemExchangeRateService,
    private readonly browser: BrowserService,
    private readonly snackbar: SnackBarService,
    private readonly logger: LoggerService) { }

  public ngOnInit(): void {
    this.optionsChange.subscribe(() => this.evaluate(this.item));
  }

  public onEvaluateWheel(event: WheelEvent): void {
    if (!this.result$.value || !this.result$.value.rate) {
      return;
    }

    const factor = event.deltaY > 0 ? -1 : 1;
    let index = this.currencies.findIndex(x => x.id === this.result$.value.rate.currency.id);
    index += factor;
    if (index >= this.currencies.length) {
      index = 0;
    } else if (index < 0) {
      index = this.currencies.length - 1;
    }

    this.result$.next(null);
    this.evaluate(this.item, this.currencies[index]);
  }

  public onClick(event: MouseEvent): void {
    const result = this.result$.getValue();
    if (result?.rate?.url) {
      this.browser.open(result.rate.url, event.ctrlKey);
    }
  }

  public onAmountClick(amount: number, count?: number): void {
    const { currency } = this.result$.value.rate;
    this.evaluateResult.next({
      amount, count, currency
    });
  }

  private evaluate(item: Item, currency?: Currency): void {
    this.exchangeRate
      .get(item, currency ? [currency] : this.currencies, this.options.leagueId)
      .subscribe(
        result => {
          if (result) {
            this.inverse$.next(result.amount < 1 && result.factor <= 1 && item.rarity === ItemRarity.Currency);
          }
          this.result$.next({ rate: result });
        },
        error => this.handleError(error)
      );
  }

  private handleError(error: any): void {
    this.result$.next({ error: true });
    this.logger.warn(error);
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'evaluate.error'}`);
  }
}
