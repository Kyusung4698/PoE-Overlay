import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { FeatureSettingsService } from '@app/feature/feature-settings.service';
import { TradeHighlightWindowData, TradeHighlightWindowService } from '@modules/trade/service';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';
import { StashService } from '@shared/module/poe/stash';
import { BehaviorSubject } from 'rxjs';

enum TradeStashFactor {
  Normal = 1,
  Quad = 0.5
}

@Component({
  selector: 'app-trade-highlight-window',
  templateUrl: './trade-highlight-window.component.html',
  styleUrls: ['./trade-highlight-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeHighlightWindowComponent implements OnInit, OnDestroy {
  private subscription: EventSubscription;

  public data$ = new BehaviorSubject<TradeHighlightWindowData>(null);

  public factor = TradeStashFactor.Normal;

  constructor(
    private readonly window: TradeHighlightWindowService,
    private readonly settings: FeatureSettingsService,
    private readonly stash: StashService,
    private readonly ngZone: NgZone) { }

  public ngOnInit(): void {
    this.updateData(this.window.data$.get());
    this.subscription = this.window.data$.on(data => {
      this.ngZone.run(() => {
        this.updateData(data);
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onSearch(item: string): void {
    this.stash.highlight(item);
  }

  public onFactorChange(stash?: string): void {
    this.factor = this.factor === TradeStashFactor.Quad
      ? TradeStashFactor.Normal : TradeStashFactor.Quad;
    if (stash) {
      this.settings.update((settings: TradeFeatureSettings) => {
        settings.tradeStashFactor[stash] = this.factor;
      }).subscribe();
    }
  }

  private updateData(data: TradeHighlightWindowData): void {
    this.settings.get().subscribe((settings: TradeFeatureSettings) => {
      const factor = settings.tradeStashFactor[data.stash];
      if (factor) {
        this.factor = factor;
      } else {
        this.factor = data.left > 13 || data.top > 13
          ? TradeStashFactor.Quad : TradeStashFactor.Normal;
      }
      this.data$.next(data);
    });
  }
}
