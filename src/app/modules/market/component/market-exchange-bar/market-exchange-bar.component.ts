import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TradeExchangeRequest } from '@shared/module/poe/trade/exchange';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-market-exchange-bar',
  templateUrl: './market-exchange-bar.component.html',
  styleUrls: ['./market-exchange-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangeBarComponent {
  private toggled = false;

  public records$ = new BehaviorSubject<TradeExchangeRequest[]>([]);
  public recordsVisible$ = new BehaviorSubject<boolean>(false);

  @Input()
  public request: TradeExchangeRequest;

  @Output()
  public requestChange = new EventEmitter<TradeExchangeRequest>();

  @Output()
  public highlight = new EventEmitter<string>();

  @Output()
  public toggle = new EventEmitter<boolean>();

  @Output()
  public search = new EventEmitter<void>();

  public onKeyup(input: HTMLInputElement): void {
    this.highlight.next((input.value || '').toLowerCase());
  }

  public onResetClick(request?: TradeExchangeRequest): void {
    this.recordsVisible$.next(false);
    if (request) {
      this.requestChange.next(JSON.parse(JSON.stringify(request)));
    } else {
      this.requestChange.next();
    }
  }

  public onToggleClick(): void {
    this.toggled = !this.toggled;
    this.toggle.next(this.toggled);
  }

  public onSearch(): void {
    this.recordsVisible$.next(false);
    this.records$.value.unshift(JSON.parse(JSON.stringify(this.request)));
    if (this.records$.value.length > 10) {
      this.records$.value.pop();
    }
    this.records$.next(this.records$.value);
    this.search.next();
  }
}
