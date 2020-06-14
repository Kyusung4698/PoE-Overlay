import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-filter-misc',
  templateUrl: './market-item-search-filter-misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchFilterMiscComponent {
  @Input()
  public request: TradeSearchRequest;
}
