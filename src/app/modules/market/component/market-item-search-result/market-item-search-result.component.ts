import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { TradeFetchResultEntry } from '@shared/module/poe/trade';

@Component({
  selector: 'app-market-item-search-result',
  templateUrl: './market-item-search-result.component.html',
  styleUrls: ['./market-item-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchResultComponent {
  @HostBinding('class.whispered')
  public whispered = false;

  @Input()
  public entry: TradeFetchResultEntry;

  @Output()
  public whisper = new EventEmitter<string>();

  public onWhisper(): void {
    this.whispered = true;
    this.whisper.next(this.entry.listing.whisper);
  }
}
