import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-trade-static-frame',
  templateUrl: './trade-static-frame.component.html',
  styleUrls: ['./trade-static-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeStaticFrameComponent {
  @Input()
  public id: string;

  @Input()
  public count: number;

  @Input()
  public amount: number;

  @Input()
  public reverse: boolean;

  @Input()
  public small: boolean;

  @Input()
  public medium: boolean;
}
