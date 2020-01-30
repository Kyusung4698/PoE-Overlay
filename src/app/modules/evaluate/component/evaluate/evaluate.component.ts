import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SnackBarService } from '@shared/module/material/service';
import { ItemEvaluateResult, ItemEvaluateService } from '@shared/module/poe/service';
import { Currency, Item, ItemRarity } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';

interface EvaluateResult {
  error?: boolean;
  evaluate?: ItemEvaluateResult;
}

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateComponent {
  private _currencies: Currency[];

  public inverse$ = new BehaviorSubject<boolean>(false);
  public result$ = new BehaviorSubject<EvaluateResult>(null);

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
    private readonly itemEvaluateService: ItemEvaluateService,
    private readonly snackbar: SnackBarService) { }

  public onEvaluateWheel(event: WheelEvent): void {
    if (!this.result$.value || !this.result$.value.evaluate) {
      return;
    }

    const factor = event.deltaY > 0 ? -1 : 1;
    let index = this.currencies.findIndex(x => x.id === this.result$.value.evaluate.currency.id);
    index += factor;
    if (index >= this.currencies.length) {
      index = 0;
    } else if (index < 0) {
      index = this.currencies.length - 1;
    }
    this.result$.next(null);
    this.evaluate(this.item, this.currencies[index]);
  }

  private evaluate(item: Item, currency?: Currency): void {
    this.itemEvaluateService
      .evaluate(item, currency ? [currency] : this.currencies)
      .subscribe(
        result => {
          if (result) {
            this.inverse$.next(result.amount < 1 && item.rarity === ItemRarity.Currency);
          }
          this.result$.next({ evaluate: result });
        },
        error => this.handleEvaluateError(error)
      );
  }

  private handleEvaluateError(error: any): void {
    this.result$.next({ error: true });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'evaluate.error'}`);
  }
}
