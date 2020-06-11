import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-input-boolean',
  templateUrl: './market-input-boolean.component.html',
  styleUrls: ['./market-input-boolean.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputBooleanComponent {
  @Input()
  public label: string;

  @Input()
  public path: string;

  @Input()
  public request: TradeSearchRequest;
}
