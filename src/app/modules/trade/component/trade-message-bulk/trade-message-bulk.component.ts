import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeBulkMessage, TradeWhisperDirection } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-bulk',
  templateUrl: './trade-message-bulk.component.html',
  styleUrls: ['./trade-message-bulk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageBulkComponent {
  private _message: TradeBulkMessage;

  public get message(): TradeBulkMessage {
    return this._message;
  }

  @Input()
  public set message(message: TradeBulkMessage) {
    this._message = JSON.parse(JSON.stringify(message));
    if (this._message.direction === TradeWhisperDirection.Outgoing) {
      const count = this._message.count1;
      this._message.count1 = this._message.count2;
      this._message.count2 = count;
      const type = this._message.type1;
      this._message.type1 = this._message.type2;
      this._message.type2 = type;
    }
  }
}
