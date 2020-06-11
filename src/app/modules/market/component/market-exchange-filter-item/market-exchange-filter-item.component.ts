import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TradeStatic, TradeStaticGroup, TradeStaticsService } from '@shared/module/poe/trade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-market-exchange-filter-item',
  templateUrl: './market-exchange-filter-item.component.html',
  styleUrls: ['./market-exchange-filter-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangeFilterItemComponent implements OnInit {
  public groups$: Observable<TradeStaticGroup[]>;

  @Input()
  public highlightTerm: string;

  @Input()
  public items: string[];

  @Output()
  public update = new EventEmitter<void>();

  constructor(private readonly statics: TradeStaticsService) { }

  public ngOnInit(): void {
    this.groups$ = this.statics.get();
  }

  public onToggleItem(id: string): void {
    const index = this.items.findIndex(x => x === id);
    if (index === -1) {
      this.items.push(id);
    } else {
      this.items.splice(index, 1);
    }
    this.items = this.items;
    this.update.next();
  }

  public isHighlighted(item: TradeStatic): boolean {
    if (!this.highlightTerm?.length) {
      return false;
    }
    return item.id.toLowerCase().includes(this.highlightTerm)
      || item.name.toLowerCase().includes(this.highlightTerm);
  }
}
