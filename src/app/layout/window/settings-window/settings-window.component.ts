import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EventSubscription } from '@app/event';
import { FeatureConfig, FeatureModule, FeatureSettings, FEATURE_MODULES } from '@app/feature';
import { FeatureSettingsService } from '@app/feature/feature-settings.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { mergeMap, throttleTime } from 'rxjs/operators';
import { SettingsFeatureContainerComponent } from '../../component';
import { SettingsFeature, SettingsWindowService } from '../../service';

@Component({
    selector: 'app-settings-window',
    templateUrl: './settings-window.component.html',
    styleUrls: ['./settings-window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsWindowComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly settingsQueue = new Subject();
    private queueSubscription: Subscription;
    private dataSubscription: EventSubscription;

    public selectedIndex$ = new BehaviorSubject<number>(0);

    public settings$: Observable<FeatureSettings>;
    public features: FeatureConfig<FeatureSettings>[];

    @ViewChildren(SettingsFeatureContainerComponent)
    public containers: QueryList<SettingsFeatureContainerComponent>;

    constructor(
        @Inject(FEATURE_MODULES)
        private readonly modules: FeatureModule<FeatureSettings>[],
        private readonly settings: FeatureSettingsService,
        private readonly window: SettingsWindowService,
        private readonly ngZone: NgZone) { }

    public ngOnInit(): void {
        this.settings$ = this.settings.get();
        this.features = this.modules.map(x => x.getConfig());
        this.queueSubscription = this.settingsQueue.pipe(
            throttleTime(500, undefined, { trailing: true, leading: false }),
            mergeMap(settings => this.settings.put(settings))
        ).subscribe();
        this.dataSubscription = this.window.data$.on(({ activeFeature }) => {
            this.ngZone.run(() => this.updateTab(activeFeature));
        });
    }

    public ngAfterViewInit(): void {
        const { activeFeature } = this.window.data$.get();
        this.updateTab(activeFeature);
    }

    public ngOnDestroy(): void {
        this.queueSubscription?.unsubscribe();
        this.dataSubscription?.unsubscribe();
    }

    public onSettingsChange(settings: FeatureSettings): void {
        this.settingsQueue.next(settings);
    }

    public onSelectedIndexChange(index: number): void {
        const containerIndex = index - 1;
        const container = this.containers.toArray()[containerIndex];
        if (container) {
            container.instance.load();
        }
    }

    public onSupportToggle(): void {
        this.window.open(SettingsFeature.Support).subscribe();
    }

    private updateTab(activeFeature: SettingsFeature): void {
        const feature = activeFeature !== SettingsFeature.Support
            ? this.features.findIndex(x => x.name === activeFeature)
            : this.features.length + 1;
        const index = feature + 1;
        if (index > 0) {
            this.selectedIndex$.next(0);
            setTimeout(() => this.selectedIndex$.next(index));
        }
    }
}
