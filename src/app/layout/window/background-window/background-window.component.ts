import { ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AnnotationCondition, AnnotationService } from '@app/annotation';
import { AssetService } from '@app/assets';
import { WindowName } from '@app/config';
import { Hotkey } from '@app/config/hotkey';
import { EventSubscription } from '@app/event';
import { FeatureModule, FeatureSettings, FEATURE_MODULES } from '@app/feature';
import { FeatureSettingsService } from '@app/feature/feature-settings.service';
import { NotificationService } from '@app/notification';
import { InfoUpdatesEvent, NewGameEvents, OnPressedEvent, OWFileListener, OWGameClassId, OWGameListener, OWGamesEventsListener, OWHotkeysListener, OWWindow, OWWindowsListener, RunningGameInfo, WindowState, WindowStateChangedEvent } from '@app/odk';
import { concat, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AnnotationWindowService, LauncherWindowService, NotificationWindowService, SettingsWindowService } from '../../service';

@Component({
    selector: 'app-background-window',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundWindowComponent implements OnInit, OnDestroy {
    private settingsChange: EventSubscription;
    private shouldQuit = false;

    private readonly game: OWGameListener;
    private readonly events: OWGamesEventsListener;
    private readonly hotkeys: OWHotkeysListener;
    private readonly windows: OWWindowsListener;
    private readonly log: OWFileListener;

    constructor(
        @Inject(FEATURE_MODULES)
        private readonly modules: FeatureModule<FeatureSettings>[],
        private readonly settings: FeatureSettingsService,
        private readonly notificationWindow: NotificationWindowService,
        private readonly notification: NotificationService,
        private readonly annotationWindow: AnnotationWindowService,
        private readonly annotation: AnnotationService,
        private readonly settingsWindow: SettingsWindowService,
        private readonly launcherWindow: LauncherWindowService,
        private readonly asset: AssetService,
        private readonly ngZone: NgZone) {
        this.game = new OWGameListener({
            onGameStarted: this.onGameStarted.bind(this),
            onGameEnded: this.onGameEnded.bind(this),
            onGameResolutionChanged: this.onGameResolutionChanged.bind(this)
        });
        this.events = new OWGamesEventsListener({
            onInfoUpdates: this.onInfoUpdates.bind(this),
            onNewEvents: this.onNewEvents.bind(this),
        }, ['death', 'kill', 'me', 'match_info']);
        this.hotkeys = new OWHotkeysListener({
            onPressed: this.onKeyPressed.bind(this)
        });
        this.windows = new OWWindowsListener({
            onStateChange: this.onStateChange.bind(this)
        });
        this.log = new OWFileListener('log', {
            onLineAdd: this.onLogLineAdd.bind(this),
            onError: this.onLogError.bind(this),
        });
    }

    public ngOnInit(): void {
        this.windows.start();
        this.shouldQuit = true;
        this.launcherWindow.open();
        this.asset.load().subscribe(() => {
            this.settingsChange = this.settings.change().on(settings => {
                this.ngZone.run(() => {
                    this.modules.forEach(module => {
                        if (module.onSettingsChange) {
                            module.onSettingsChange(settings);
                        }
                    });
                });
            });
            this.game.start();
        });
    }

    public ngOnDestroy(): void {
        this.settingsChange?.unsubscribe();
        this.hotkeys.stop();
        this.game.stop();
        this.events.stop();
        this.windows.stop();
    }

    private onKeyPressed(event: OnPressedEvent): void {
        switch (event.name) {
            case Hotkey.SettingsToggle:
                this.settingsWindow.toggle().subscribe();
                break;
            default:
                for (const module of this.modules) {
                    if (!module.onKeyPressed) {
                        continue;
                    }
                    for (const feature of module.getFeatures()) {
                        if (feature.hotkey !== event.name) {
                            continue;
                        }
                        this.settings.get().subscribe(
                            settings => module.onKeyPressed(feature.hotkey, settings)
                        );
                        return;
                    }
                }
        }
    }

    private onGameStarted(info: RunningGameInfo): void {
        if (info?.classId !== OWGameClassId.PathOfExile) {
            return;
        }

        this.shouldQuit = false;
        this.launcherWindow.close();

        const { width, height } = info;
        forkJoin([
            this.annotationWindow.open(width, height),
            this.notificationWindow.open(width, height)
        ]).pipe(
            mergeMap(() => this.events.start(false)),
        ).subscribe(result => {
            this.settings.get().subscribe(settings => {
                this.modules.forEach(module => {
                    if (module.onInfo) {
                        module.onInfo(info, settings);
                    }
                });

                const path = info.executionPath.split('/');
                path.pop();
                const log = `${path.join('/')}/logs/Client.txt`;
                this.log.start(log);

                this.hotkeys.start();
            });
            if (!result) {
                this.notification.show('event.start-error');
            }
        });
    }

    private onGameEnded(info: RunningGameInfo): void {
        if (info?.classId !== OWGameClassId.PathOfExile) {
            return;
        }

        this.events.stop();
        this.settings.get().subscribe(settings => {
            this.modules.forEach(module => {
                if (module.onInfo) {
                    module.onInfo(info, settings);
                }
            });

            forkJoin([
                this.settingsWindow.close(),
                this.notificationWindow.close(),
                this.annotationWindow.close()
            ]).pipe(
                mergeMap(() => new OWWindow().close())
            ).subscribe(() => console.log('PoE Overlay closed.'));
        });
    }

    private onInfoUpdates(event: InfoUpdatesEvent): void {
        this.settings.get().subscribe(settings => {
            this.modules.forEach(module => {
                if (module.onGameEvent) {
                    module.onGameEvent(event, settings);
                }
            });
        });
    }

    private onNewEvents(event: NewGameEvents): void {
        if (!event?.events?.length) {
            return;
        }

        this.settings.get().subscribe(settings => {
            this.modules.forEach(module => {
                event.events.forEach(e => {
                    if (module.onGameEvent) {
                        module.onGameEvent(e, settings);
                    }
                });
            });
        });
    }

    private onGameResolutionChanged(info: RunningGameInfo): void {
        if (info?.classId !== OWGameClassId.PathOfExile) {
            return;
        }
        const { width, height } = info;
        this.notificationWindow.resize(width, height).subscribe();
    }

    private onStateChange(event: WindowStateChangedEvent): void {
        const closed = event.window_state === WindowState.Closed;
        const minimized = event.window_state === WindowState.Minimized;
        const hidden = closed || minimized;
        switch (event.window_name) {
            case WindowName.Launcher:
                if (closed && this.shouldQuit) {
                    new OWWindow().close().subscribe();
                }
                break;
            case WindowName.Settings:
                concat(
                    this.annotation.update(AnnotationCondition.SettingsClose, hidden),
                    this.annotation.update(AnnotationCondition.SettingsOpen, !hidden)
                ).subscribe();
                break;
            case WindowName.Market:
                concat(
                    this.annotation.update(AnnotationCondition.MarketClose, hidden),
                    this.annotation.update(AnnotationCondition.MarketOpen, !hidden)
                ).subscribe();
                break;
            case WindowName.Evaluate:
                concat(
                    this.annotation.update(AnnotationCondition.EvaluateClose, hidden),
                    this.annotation.update(AnnotationCondition.EvaluateOpen, !hidden)
                ).subscribe();
                break;
            case WindowName.Inspect:
                concat(
                    this.annotation.update(AnnotationCondition.InspectClose, hidden),
                    this.annotation.update(AnnotationCondition.InspectOpen, !hidden)
                ).subscribe();
                break;
            default:
                break;
        }
    }

    public onLogLineAdd(line: string): void {
        this.modules.forEach(module => {
            if (module.onLogLineAdd) {
                module.onLogLineAdd(line);
            }
        });
    }

    public onLogError(error: string): void {
        console.error(`An unexpected error occured while listening to the Client.txt file. ${error}`, error);
    }
}
