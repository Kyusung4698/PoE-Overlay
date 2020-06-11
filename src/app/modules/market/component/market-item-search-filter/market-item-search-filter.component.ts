import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-filter',
  templateUrl: './market-item-search-filter.component.html',
  styleUrls: ['./market-item-search-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchFilterComponent {
  @Input()
  public request: TradeSearchRequest;
}
