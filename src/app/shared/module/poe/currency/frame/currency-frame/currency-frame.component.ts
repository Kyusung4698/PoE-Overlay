import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyRange } from '../../currency';

@Component({
  selector: 'app-currency-frame',
  templateUrl: './currency-frame.component.html',
  styleUrls: ['./currency-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyFrameComponent {
  @Input()
  public label: string;

  @Input()
  public currency: string;

  @Input()
  public amount: number;

  @Input()
  public range: CurrencyRange;
}
