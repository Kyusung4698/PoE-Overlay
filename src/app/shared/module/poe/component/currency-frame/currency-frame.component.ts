import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Currency } from '../../type';

@Component({
  selector: 'app-currency-frame',
  templateUrl: './currency-frame.component.html',
  styleUrls: ['./currency-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyFrameComponent {
  @Input()
  public currency: Currency;

  @Input()
  public amount: number;
}
