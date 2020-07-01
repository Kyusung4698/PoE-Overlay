import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { FeatureSettingsService } from '@app/feature/feature-settings.service';
import { SettingsWindowService, SettingsFeature } from '@layout/service';
import { TradeWindowData, TradeWindowService } from '@modules/trade/service';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';
import { TradeExchangeMessage, TradeMessage } from '@shared/module/poe/trade/chat';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trade-window',
  templateUrl: './trade-window.component.html',
  styleUrls: ['./trade-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeWindowComponent implements OnInit, OnDestroy {
  private subscription: EventSubscription;

  public toggle = true;
  public data$ = new BehaviorSubject<TradeWindowData>(null);

  constructor(
    private readonly window: TradeWindowService,
    private readonly ngZone: NgZone,
    private readonly settings: FeatureSettingsService,
    private readonly settingsWindow: SettingsWindowService) { }

  public ngOnInit(): void {
    this.data$.next(this.window.data$.get());
    this.subscription = this.window.data$.on(data => {
      this.ngZone.run(() => {
        this.data$.next(data);
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onDismiss(message: TradeExchangeMessage): void {
    const data = this.window.data$.get();
    data.removed.push(message);
    this.window.data$.next(data);
  }

  public onPinnedChange(pinned: boolean): void {
    this.settings.update((settings: TradeFeatureSettings) =>
      settings.tradeWindowPinned = pinned
    ).subscribe();
  }

  public onSettingsToggle(): void {
    this.settingsWindow.toggle(SettingsFeature.Trade).subscribe();
  }

  public getMessages(data: TradeWindowData): TradeMessage[] {
    return data.messages.filter(message => !data.removed.includes(message));
  }
}
