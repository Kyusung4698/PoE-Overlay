import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';

@Component({
  selector: 'app-trade-message-action',
  templateUrl: './trade-message-action.component.html',
  styleUrls: ['./trade-message-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageActionComponent {
  @HostBinding('class.visible')
  public get isVisible(): boolean {
    return this.visible[this.action];
  }

  @Input()
  public title = '';

  @Input()
  public action: TradeMessageAction;

  @Input()
  public visible: TradeMessageActionState;

  @Output()
  public execute = new EventEmitter<string>();

  public onExecute(event: MouseEvent): void {
    event.stopPropagation();
    this.execute.next(this.action);
  }
}
