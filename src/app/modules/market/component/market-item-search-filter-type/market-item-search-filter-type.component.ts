import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-filter-type',
  templateUrl: './market-item-search-filter-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchFilterTypeComponent {
  @Input()
  public request: TradeSearchRequest;
}
