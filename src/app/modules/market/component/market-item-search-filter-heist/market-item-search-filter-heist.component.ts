import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-filter-heist',
  templateUrl: './market-item-search-filter-heist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchFilterHeistComponent {
  @Input()
  public request: TradeSearchRequest;
}
