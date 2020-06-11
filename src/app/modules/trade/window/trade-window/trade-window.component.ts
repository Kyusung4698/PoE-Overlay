import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { TradeWindowData, TradeWindowService } from '@modules/trade/service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trade-window',
  templateUrl: './trade-window.component.html',
  styleUrls: ['./trade-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeWindowComponent implements OnInit, OnDestroy {
  private subscription: EventSubscription;

  public data$ = new BehaviorSubject<TradeWindowData>(null);

  constructor(
    private readonly window: TradeWindowService,
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
}
