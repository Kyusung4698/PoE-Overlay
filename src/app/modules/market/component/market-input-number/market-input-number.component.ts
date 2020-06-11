import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarketInputBaseComponent } from '../market-input-base.component';

@Component({
  selector: 'app-market-input-number',
  templateUrl: './market-input-number.component.html',
  styleUrls: ['./market-input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputNumberComponent extends MarketInputBaseComponent {
  @Input()
  public name: string;

  @Input()
  public width: string;

  public get value(): any { return this.getValue(this.name); }
  public set value(value: any) { this.setValue(this.name, value); }

  protected update(): void { }
}
