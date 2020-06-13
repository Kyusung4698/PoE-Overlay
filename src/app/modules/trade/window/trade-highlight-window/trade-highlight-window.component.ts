import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { TradeHighlightWindowData, TradeHighlightWindowService } from '@modules/trade/service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trade-highlight-window',
  templateUrl: './trade-highlight-window.component.html',
  styleUrls: ['./trade-highlight-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeHighlightWindowComponent implements OnInit, OnDestroy {
  private subscription: EventSubscription;

  public data$ = new BehaviorSubject<TradeHighlightWindowData>(null);

  public factor = 1;

  constructor(
    private readonly window: TradeHighlightWindowService,
    private readonly ngZone: NgZone) { }

  public ngOnInit(): void {
    this.data$.next(this.window.data$.get());
    this.subscription = this.window.data$.on(data => this.ngZone.run(() => {
      this.data$.next(data);
    }));
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onQuadChange(): void {
    this.factor = this.factor === 0.5 ? 1 : 0.5;
  }
}
