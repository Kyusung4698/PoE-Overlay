import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BrowserService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemExchangeRateResult, ItemExchangeRateService } from '@shared/module/poe/service';
import { Currency, Item, ItemRarity } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';

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
export class EvaluateExchangeRateComponent {
  private _currencies: Currency[];

  public inverse$ = new BehaviorSubject<boolean>(false);
  public result$ = new BehaviorSubject<Result>(null);

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

  constructor(
    private readonly exchangeRateService: ItemExchangeRateService,
    private readonly browser: BrowserService,
    private readonly snackbar: SnackBarService) { }

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

  private evaluate(item: Item, currency?: Currency): void {
    this.exchangeRateService
      .get(item, currency ? [currency] : this.currencies)
      .subscribe(
        result => {
          if (result) {
            this.inverse$.next(result.amount < 1 && item.rarity === ItemRarity.Currency);
          }
          this.result$.next({ rate: result });
        },
        error => this.handleEvaluateError(error)
      );
  }

  private handleEvaluateError(error: any): void {
    this.result$.next({ error: true });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'evaluate.error'}`);
  }
}
