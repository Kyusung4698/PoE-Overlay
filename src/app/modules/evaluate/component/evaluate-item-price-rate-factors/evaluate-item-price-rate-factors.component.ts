import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { ItemPriceRateResult } from '@shared/module/poe/price';

@Component({
  selector: 'app-evaluate-item-price-rate-factors',
  templateUrl: './evaluate-item-price-rate-factors.component.html',
  styleUrls: ['./evaluate-item-price-rate-factors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPriceRateFactorsComponent {
  @Input()
  public rate: ItemPriceRateResult;

  @Input()
  public inverse: boolean;

  @Output()
  public inverseToggle = new EventEmitter<void>();

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  public onAmountClick(event: MouseEvent, amount: number, count?: number): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const { currency } = this.rate;
    const selectEvent: EvaluateSelectEvent = {
      amount,
      count,
      currency
    };
    this.evaluateSelect.next(selectEvent);
  }

  public onToggleInverse(): void {
    this.inverseToggle.next();
  }
}
