import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';
import { TradeExchangeMessage, TradeWhisperDirection } from '@shared/module/poe/trade/chat';

@Component({
  selector: 'app-trade-message',
  templateUrl: './trade-message.component.html',
  styleUrls: ['./trade-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageComponent implements OnInit {
  public visible: TradeMessageActionState = {};
  public activated: TradeMessageActionState = {};

  @Input()
  public message: TradeExchangeMessage;

  public ngOnInit(): void {
    if (this.message.direction === TradeWhisperDirection.Incoming) {
      this.visible[TradeMessageAction.Invite] = true;
      this.visible[TradeMessageAction.Trade] = true;
      this.visible[TradeMessageAction.Wait] = true;
      this.visible[TradeMessageAction.ItemGone] = true;
      this.visible[TradeMessageAction.ItemHighlight] = true;
      this.visible[TradeMessageAction.Whisper] = true;
    } else {
      this.visible[TradeMessageAction.Invite] = true;
      this.visible[TradeMessageAction.Trade] = true;
      this.visible[TradeMessageAction.Resend] = true;
      this.visible[TradeMessageAction.Finished] = true;
      this.visible[TradeMessageAction.Whisper] = true;
      this.visible[TradeMessageAction.Dismiss] = true;
    }
  }

  public onActionExecute(action: TradeMessageAction): void {
    this.activated[action] = true;

    // todo: execute action
  }
}
