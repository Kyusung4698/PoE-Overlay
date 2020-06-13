import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeMapList } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-map-tier',
  templateUrl: './trade-message-map-tier.component.html',
  styleUrls: ['./trade-message-map-tier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageMapTierComponent {
  @Input()
  public list: TradeMapList;

  @Input()
  public left: boolean;
}
