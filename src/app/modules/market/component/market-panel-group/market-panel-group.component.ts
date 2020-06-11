import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, OnDestroy, QueryList } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketPanelComponent } from '../market-panel/market-panel.component';

@Component({
  selector: 'app-market-panel-group',
  templateUrl: './market-panel-group.component.html',
  styleUrls: ['./market-panel-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketPanelGroupComponent implements OnDestroy, AfterViewInit {
  private changeSubscription: Subscription;

  public panels$ = new BehaviorSubject<MarketPanelComponent[]>([]);

  @ContentChildren(MarketPanelComponent)
  public panels: QueryList<MarketPanelComponent>;

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.changeSubscription = this.panels.changes.pipe(
        map(() => this.panels.toArray()),
      ).subscribe(panels => {
        this.panels$.next(panels);
      });
      this.panels.notifyOnChanges();
    });
  }

  public ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }
}
