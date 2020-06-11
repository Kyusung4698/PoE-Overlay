import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-market-input-select-option',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputSelectOptionComponent {
  public html: string;

  @Input()
  public text: string;

  @Input()
  public value: any;
}
