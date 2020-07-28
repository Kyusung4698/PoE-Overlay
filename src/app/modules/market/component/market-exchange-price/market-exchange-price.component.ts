import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { TradeFetchListingPrice } from '@shared/module/poe/trade';

export interface WhisperEvent {
  itemAmount: number;
  valueAmount: number;
}

@Component({
  selector: 'app-market-exchange-price',
  templateUrl: './market-exchange-price.component.html',
  styleUrls: ['./market-exchange-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangePriceComponent implements OnInit {
  public max: number;
  public min: number;
  public value: number;

  @HostBinding('class.whispered')
  public whispered = false;

  @Input()
  public status: string;

  @Input()
  public seller: string;

  @Input()
  public price: TradeFetchListingPrice;

  @Output()
  public whisper = new EventEmitter<WhisperEvent>();

  public ngOnInit(): void {
    this.min = 1;
    this.max = Math.floor(this.price.item.stock / this.price.item.amount);
    this.value = 1;
  }

  public onWhisper(itemAmount: number, valueAmount: number): void {
    this.whispered = true;
    this.whisper.next({
      itemAmount,
      valueAmount
    });
  }

  public onSub(event: MouseEvent): void {
    const factor = this.getFactor(event);
    this.value = Math.max(this.min, this.value - factor);
  }

  public onAdd(event: MouseEvent): void {
    const factor = this.getFactor(event);
    this.value = Math.min(this.max, this.value + factor);
  }

  private getFactor(event: MouseEvent): number {
    if (event.ctrlKey) {
      return 50;
    }
    if (event.shiftKey) {
      return 25;
    }
    if (event.altKey) {
      return 5;
    }
    return 1;
  }
}
