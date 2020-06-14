import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemPriceRateResult } from '@shared/module/poe/price';

@Component({
  selector: 'app-evaluate-item-price-rate-values',
  templateUrl: './evaluate-item-price-rate-values.component.html',
  styleUrls: ['./evaluate-item-price-rate-values.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPriceRateValuesComponent {
  @Input()
  public rate: ItemPriceRateResult;

  @Output()
  public browse = new EventEmitter<boolean>();

  public onClick(event: MouseEvent): void {
    event.preventDefault();
    this.browse.next(event.ctrlKey);
  }
}
