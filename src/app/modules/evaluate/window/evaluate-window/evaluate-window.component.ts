import { ChangeDetectionStrategy, Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventSubscription } from '@app/event';
import { NotificationService } from '@app/notification';
import { OWGames } from '@app/odk';
import { SettingsFeature, SettingsWindowService } from '@layout/service';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { EvaluateWindowData, EvaluateWindowService } from '@modules/evaluate/service';
import { StashPriceTagType, StashService } from '@shared/module/poe/stash';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { buffer, debounceTime, filter, mergeMap } from 'rxjs/operators';

const DISPOSE_TIMEOUT = 1000 * 15;

@Component({
    selector: 'app-evaluate-window',
    templateUrl: './evaluate-window.component.html',
    styleUrls: ['./evaluate-window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateWindowComponent implements OnInit, OnDestroy {
    private readonly selectQueue = new Subject<EvaluateSelectEvent>();
    private disposeSubscription: Subscription;
    private queueSubscription: Subscription;
    private subscription: EventSubscription;

    public data$ = new BehaviorSubject<EvaluateWindowData>(null);

    constructor(
        private readonly window: EvaluateWindowService,
        private readonly stash: StashService,
        private readonly notification: NotificationService,
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
        this.registerQueue();
    }

    public ngOnDestroy(): void {
        this.dispose();
    }

    public onToggleSettings(): void {
        this.settings.toggle(SettingsFeature.Evaluate).subscribe();
    }

    public onEvaluateSelect(event: EvaluateSelectEvent): void {
        this.selectQueue.next(event);
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
        this.unregisterQueue();
    }

    private reset(): void {
        this.window.minimize().subscribe(() => {
            this.data$.next(null);
        });
    }

    private registerQueue(): void {
        this.queueSubscription = this.selectQueue.pipe(
            buffer(this.selectQueue.pipe(
                debounceTime(250)
            )),
            filter(events => events.length > 0),
            mergeMap(([event, double]) => {
                const { amount, currency, count } = event;
                const type = double ? StashPriceTagType.Negotiable : StashPriceTagType.Exact;
                this.notification.show(double ? 'evaluate.tag.negotiable' : 'evaluate.tag.exact');
                return this.stash.copyPrice({
                    amount, currency,
                    count, type
                });
            })
        ).subscribe(() => this.reset());
    }

    private unregisterQueue(): void {
        this.queueSubscription?.unsubscribe();
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
