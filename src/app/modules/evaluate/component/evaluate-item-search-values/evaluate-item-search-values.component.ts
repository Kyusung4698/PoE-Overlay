import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TradeFetchAnalyzeValues } from '@shared/module/poe/trade';

@Component({
  selector: 'app-evaluate-item-search-values',
  templateUrl: './evaluate-item-search-values.component.html',
  styleUrls: ['./evaluate-item-search-values.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemSearchValuesComponent {
  @Input()
  public currency: string;

  @Input()
  public currencies: string[];

  @Output()
  public currencySelect = new EventEmitter<string>();

  @Input()
  public values: TradeFetchAnalyzeValues;

  @Output()
  public browse = new EventEmitter<boolean>();

  public onWheel(event: WheelEvent): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const index = this.currencies.findIndex(x => x === this.currency) + factor;
    if (index >= this.currencies.length) {
      this.currencySelect.next(this.currencies[0]);
    } else if (index < 0) {
      this.currencySelect.next(this.currencies[this.currencies.length - 1]);
    } else {
      this.currencySelect.next(this.currencies[index]);
    }
  }

  public onClick(event: MouseEvent): void {
    event.preventDefault();
    this.browse.next(event.ctrlKey);
  }
}
