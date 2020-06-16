import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeMapList, TradeMapMessage, TradeWhisperDirection } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-map',
  templateUrl: './trade-message-map.component.html',
  styleUrls: ['./trade-message-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageMapComponent {
  @Input()
  public maps1: TradeMapList;

  @Input()
  public maps2: TradeMapList;

  @Input()
  public set message(message: TradeMapMessage) {
    if (message.direction === TradeWhisperDirection.Outgoing) {
      this.maps1 = message.maps1;
      this.maps2 = message.maps2;
    } else {
      this.maps1 = message.maps2;
      this.maps2 = message.maps1;
    }
  }
}
