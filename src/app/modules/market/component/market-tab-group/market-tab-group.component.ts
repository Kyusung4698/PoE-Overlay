import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, OnDestroy, Output, QueryList } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketTabComponent } from '../market-tab/market-tab.component';

@Component({
  selector: 'app-market-tab-group',
  templateUrl: './market-tab-group.component.html',
  styleUrls: ['./market-tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketTabGroupComponent implements OnDestroy, AfterViewInit {
  private changeSubscription: Subscription;

  public tabs$ = new BehaviorSubject<MarketTabComponent[]>([]);
  public active$ = new BehaviorSubject<MarketTabComponent>(undefined);

  @ContentChildren(MarketTabComponent)
  public tabs: QueryList<MarketTabComponent>;

  @Output()
  public tabChange = new EventEmitter<number>();

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.changeSubscription = this.tabs.changes.pipe(
        map(() => this.tabs.toArray()),
      ).subscribe(tabs => {
        this.tabs$.next(tabs);
        if (!tabs.includes(this.active$.value)) {
          this.setTab(tabs[0]);
        }
      });
      this.tabs.notifyOnChanges();
    });
  }

  public ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  public onTabChange(tab: MarketTabComponent): void {
    this.setTab(tab);
  }

  private setTab(tab: MarketTabComponent): void {
    this.tabChange.next(this.tabs$.value.indexOf(tab));
    this.active$.next(tab);
  }
}
