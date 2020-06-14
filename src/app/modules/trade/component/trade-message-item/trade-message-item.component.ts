import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeItemMessage } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-item',
  templateUrl: './trade-message-item.component.html',
  styleUrls: ['./trade-message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageItemComponent {
  @Input()
  public message: TradeItemMessage;
}
