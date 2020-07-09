import { NgModule } from '@angular/core';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { NotificationService } from '@app/notification';
import { GameEvent, RunningGameInfo } from '@app/odk';
import { SharedModule } from '@shared/shared.module';
import { ReplaySettingsComponent } from './component';
import { ReplayFeatureSettings } from './replay-feature-settings';
import { ReplayService } from './service/replay.service';
import { ReplayWindowComponent } from './window';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: ReplayModule, multi: true }],
    declarations: [
        ReplaySettingsComponent,
        ReplayWindowComponent,
    ],
    exports: [ReplayWindowComponent],
    imports: [SharedModule]
})
export class ReplayModule implements FeatureModule<ReplayFeatureSettings> {
    private shouldCapture = false;
    private isRunning = false;

    constructor(
        private readonly replay: ReplayService,
        private readonly notification: NotificationService) { }

    public getConfig(): FeatureConfig<ReplayFeatureSettings> {
        const config: FeatureConfig<ReplayFeatureSettings> = {
            name: 'replay.name',
            component: ReplaySettingsComponent,
            default: {
                replayCaptureDeath: false,
                replayCaptureDeathFutureDuration: 0,
                replayCaptureDeathPastDuration: 8,
                replayCaptureKill: false,
                replayCaptureKillFutureDuration: 3,
                replayCaptureKillPastDuration: 5,
                replayCaptureManually: false,
                replayCaptureManuallyFutureDuration: 0,
                replayCaptureManuallyPastDuration: 10,
            }
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.ReplayManually }
        ];
        return features;
    }

    public onSettingsChange(settings: ReplayFeatureSettings): void {
        const shouldCapture = settings.replayCaptureManually || settings.replayCaptureDeath || settings.replayCaptureKill;
        if (shouldCapture !== this.shouldCapture) {
            this.shouldCapture = shouldCapture;
            this.updateCapturing();
        }
    }

    public onKeyPressed(hotkey: Hotkey, settings: ReplayFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.ReplayManually:
                if (settings.replayCaptureManually) {
                    this.replay.capture(
                        settings.replayCaptureManuallyPastDuration,
                        settings.replayCaptureManuallyFutureDuration
                    ).subscribe(() => { }, error => {
                        console.warn(`Could not capture a manually triggered event. ${error?.message ?? JSON.stringify(error)}`, error);
                        this.notification.show('replay.capture-error');
                    });
                }
                break;
        }
    }

    public onGameEvent(event: GameEvent, settings: ReplayFeatureSettings): void {
        switch (event?.name) {
            case 'death':
                if (settings.replayCaptureDeath) {
                    this.replay.capture(
                        settings.replayCaptureDeathPastDuration,
                        settings.replayCaptureDeathFutureDuration
                    ).subscribe(() => { }, error => {
                        console.warn(`Could not capture the death event. ${error?.message ?? JSON.stringify(error)}`, event, error);
                        this.notification.show('replay.capture-error');
                    });
                }
                break;
            case 'kill':
                if (settings.replayCaptureKill) {
                    this.replay.capture(
                        settings.replayCaptureKillPastDuration,
                        settings.replayCaptureKillFutureDuration
                    ).subscribe(() => { }, error => {
                        console.warn(`Could not capture the kill event. ${error?.message ?? JSON.stringify(error)}`, event, error);
                        this.notification.show('replay.capture-error');
                    });
                }
                break;
        }
    }

    public onInfo(info: RunningGameInfo, settings: ReplayFeatureSettings): void {
        const shouldCapture = settings.replayCaptureManually || settings.replayCaptureDeath || settings.replayCaptureKill;
        const { isRunning } = info;
        if (shouldCapture !== this.shouldCapture
            || isRunning !== this.isRunning) {
            this.isRunning = info.isRunning;
            this.shouldCapture = shouldCapture;
            this.updateCapturing();
        }
    }

    private updateCapturing(): void {
        if (this.isRunning && this.shouldCapture) {
            this.startCapturing();
        } else {
            this.stopCapturing();
        }
    }

    private startCapturing(): void {
        this.replay.start().subscribe(changed => {
            if (changed) {
                this.notification.show('replay.started');
            }
        }, error => {
            console.warn(`Could not start the replay capturing. ${error?.message ?? JSON.stringify(error)}`, error);
            this.notification.show('replay.start-error');
        });
    }

    private stopCapturing(): void {
        this.replay.stop().subscribe(changed => {
            if (changed) {
                this.notification.show('replay.stopped');
            }
        }, error => {
            console.warn(`Could not stop the replay capturing. ${error?.message ?? JSON.stringify(error)}`, error);
            this.notification.show('replay.stop-error');
        });
    }
}
