import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trade-messages',
  templateUrl: './trade-messages.component.html',
  styleUrls: ['./trade-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessagesComponent {
  @Input()
  public messages: [];

  @Output()
  public messagesChange = new EventEmitter<[]>();
}
