import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-input-range',
  templateUrl: './market-input-range.component.html',
  styleUrls: ['./market-input-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputRangeComponent {
  @Input()
  public label: string;

  @Input()
  public path: string;

  @Input()
  public request: TradeSearchRequest;
}
