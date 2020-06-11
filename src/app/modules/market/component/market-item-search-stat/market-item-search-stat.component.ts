import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeStat } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-stat',
  templateUrl: './market-item-search-stat.component.html',
  styleUrls: ['./market-item-search-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchStatComponent {
  @Input()
  public stat: TradeStat;

  @Input()
  public text: string;
}
