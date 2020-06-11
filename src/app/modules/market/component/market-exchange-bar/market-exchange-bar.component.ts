import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-market-exchange-bar',
  templateUrl: './market-exchange-bar.component.html',
  styleUrls: ['./market-exchange-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangeBarComponent {
  private toggled = false;

  @Output()
  public highlight = new EventEmitter<string>();

  @Output()
  public clear = new EventEmitter<void>();

  @Output()
  public toggle = new EventEmitter<boolean>();

  @Output()
  public search = new EventEmitter<void>();

  public onKeyup(input: HTMLInputElement): void {
    this.highlight.next((input.value || '').toLowerCase());
  }

  public onClearClick(): void {
    this.clear.next();
  }

  public onToggleClick(): void {
    this.toggled = !this.toggled;
    this.toggle.next(this.toggled);
  }

  public onSearch(): void {
    this.search.next();
  }
}
