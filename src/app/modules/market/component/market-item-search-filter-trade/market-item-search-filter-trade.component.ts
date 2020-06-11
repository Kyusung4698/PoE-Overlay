import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-filter-trade',
  templateUrl: './market-item-search-filter-trade.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchFilterTradeComponent {
  @Input()
  public request: TradeSearchRequest;
}
