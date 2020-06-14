import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-market-input',
  templateUrl: './market-input.component.html',
  styleUrls: ['./market-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputComponent {
  @Input()
  public label: string;
}
