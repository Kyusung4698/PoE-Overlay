import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeBulkMessage, TradeWhisperDirection } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-bulk',
  templateUrl: './trade-message-bulk.component.html',
  styleUrls: ['./trade-message-bulk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageBulkComponent {
  @Input()
  public type1: string;

  @Input()
  public type2: string;

  @Input()
  public count1: number;

  @Input()
  public count2: number;

  @Input()
  public set message(message: TradeBulkMessage) {
    if (message.direction === TradeWhisperDirection.Outgoing) {
      this.count1 = message.count2;
      this.count2 = message.count1;
      this.type1 = message.type2;
      this.type2 = message.type1;
    } else {
      this.count1 = message.count1;
      this.count2 = message.count2;
      this.type1 = message.type1;
      this.type2 = message.type2;
    }
  }
}
