import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TradeSearchHttpStatsFilter } from '@data/poe/schema';
import { BehaviorSubject } from 'rxjs';
import { MarketInputBaseComponent } from '../market-input-base.component';

@Component({
  selector: 'app-market-item-search-stat-group',
  templateUrl: './market-item-search-stat-group.component.html',
  styleUrls: ['./market-item-search-stat-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchStatGroupComponent extends MarketInputBaseComponent implements OnInit {
  public filters$ = new BehaviorSubject<TradeSearchHttpStatsFilter[]>([]);

  public get filters(): TradeSearchHttpStatsFilter[] { return this.getValue('filters') || []; }
  public set filters(value: TradeSearchHttpStatsFilter[]) {
    this.filters$.next(value);
    this.setValue('filters', value);
  }

  public ngOnInit(): void {
    this.update();
  }

  public onFilterRemove(index: number): void {
    const filters = this.filters;
    filters.splice(index, 1);
    this.filters = filters;
  }

  public addFilter(filter: TradeSearchHttpStatsFilter): void {
    const filters = this.filters;
    filters.push(filter);
    this.filters = filters;
  }

  public update(): void {
    this.filters$.next(this.filters);
  }
}
