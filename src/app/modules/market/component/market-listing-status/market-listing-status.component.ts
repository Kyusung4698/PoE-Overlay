import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-market-listing-status',
  templateUrl: './market-listing-status.component.html',
  styleUrls: ['./market-listing-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketListingStatusComponent {
  @Input()
  public seller: string;

  @Input()
  public status: string;
}
