import { ChangeDetectionStrategy, Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { OWGames } from '@app/odk';
import { SettingsFeature, SettingsWindowService } from '@layout/service';
import { InspectWindowData, InspectWindowService } from '@modules/inspect/service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

const DISPOSE_TIMEOUT = 1000 * 15;

@Component({
  selector: 'app-inspect-window',
  templateUrl: './inspect-window.component.html',
  styleUrls: ['./inspect-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectWindowComponent implements OnInit, OnDestroy {
  private subscription: EventSubscription;
  private disposeSubscription: Subscription;

  public data$ = new BehaviorSubject<InspectWindowData>(null);

  constructor(
    private readonly window: InspectWindowService,
    private readonly settings: SettingsWindowService,
    private readonly ngZone: NgZone) { }

  @HostListener('document:keydown.escape')
  public onKeydownHandler(): void {
    this.reset();
  }

  @HostListener('window:beforeunload')
  public onWindowBeforeUnload(): void {
    this.dispose();
  }

  public ngOnInit(): void {
    this.data$.next(this.window.data$.get());
    this.addSubscription();
    this.addEvents();
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public onToggleSettings(): void {
    this.settings.toggle(SettingsFeature.Inspect).subscribe();
  }

  public onSupportToggle(): void {
    this.settings.toggle(SettingsFeature.Support).subscribe();
  }

  private onMouseUp = (event: overwolf.games.inputTracking.MouseEvent): void => {
    if (event?.onGame) {
      this.ngZone.run(() => this.reset());
    }
  }

  private dispose(): void {
    this.removeEvents();
    this.removeSubscription();
  }

  private reset(): void {
    this.window.minimize().subscribe(() => {
      this.data$.next(null);
    });
  }

  private addEvents(): void {
    OWGames.onMouseUp.addListener(this.onMouseUp);
  }

  private removeEvents(): void {
    OWGames.onMouseUp.removeListener(this.onMouseUp);
  }

  private addSubscription(): void {
    this.subscription = this.window.data$.on(data => {
      this.ngZone.run(() => {
        if (data) {
          if (this.data$.value) {
            this.data$.next(null);
            setTimeout(() => {
              this.data$.next(data);
            });
          } else {
            this.data$.next(data);
          }
        } else {
          this.reset();
        }
      });
    });
    this.disposeSubscription = this.data$.pipe(
      debounceTime(DISPOSE_TIMEOUT),
      filter(data => !data)
    ).subscribe(() => {
      this.dispose();
      this.window.close().subscribe();
    });
  }

  private removeSubscription(): void {
    this.subscription?.unsubscribe();
    this.disposeSubscription?.unsubscribe();
  }
}
