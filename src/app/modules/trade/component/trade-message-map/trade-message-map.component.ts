import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeMapMessage, TradeDirection } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message-map',
  templateUrl: './trade-message-map.component.html',
  styleUrls: ['./trade-message-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageMapComponent {
  private _message: TradeMapMessage;

  public get message(): TradeMapMessage {
    return this._message;
  }

  @Input()
  public set message(message: TradeMapMessage) {
    this._message = JSON.parse(JSON.stringify(message));
    if (this._message.tradeDirection === TradeDirection.Outgoing) {
      const maps = this._message.maps1;
      this._message.maps1 = this._message.maps2;
      this._message.maps2 = maps;
    }
  }
}
