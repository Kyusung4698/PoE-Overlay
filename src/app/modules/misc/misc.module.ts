import { NgModule } from '@angular/core';
import { AnnotationCondition, AnnotationService } from '@app/annotation';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { NotificationService } from '@app/notification';
import { RunningGameInfo } from '@app/odk';
import { SharedModule } from '@shared/shared.module';
import { mergeMap } from 'rxjs/operators';
import { MiscSettingsComponent } from './component';
import { MiscFeatureSettings, MiscNavigation } from './misc-feature-settings';
import { MiscStashService } from './service/misc-stash.service';


@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MiscModule, multi: true }],
    declarations: [
        MiscSettingsComponent
    ],
    imports: [SharedModule]
})
export class MiscModule implements FeatureModule<MiscFeatureSettings> {
    private shouldNavigate = false;

    constructor(
        private readonly stash: MiscStashService,
        private readonly annotation: AnnotationService,
        private readonly notification: NotificationService) { }

    public getConfig(): FeatureConfig<MiscFeatureSettings> {
        const config: FeatureConfig<MiscFeatureSettings> = {
            name: 'misc.name',
            component: MiscSettingsComponent,
            default: {
                miscNavigation: MiscNavigation.Normal
            }
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.MiscStashHighlight }
        ];
        return features;
    }

    public onSettingsChange(settings: MiscFeatureSettings): void {
        const shouldNavigate = settings.miscNavigation !== MiscNavigation.Disabled;
        this.setShouldNavigate(shouldNavigate);
        this.stash.setDirection(settings.miscNavigation === MiscNavigation.Inverse);
    }

    public onInfo(_: RunningGameInfo, settings: MiscFeatureSettings): void {
        const shouldNavigate = settings.miscNavigation !== MiscNavigation.Disabled;
        this.setShouldNavigate(shouldNavigate);
        this.stash.setDirection(settings.miscNavigation === MiscNavigation.Inverse);
    }

    public onKeyPressed(hotkey: Hotkey): void {
        switch (hotkey) {
            case Hotkey.MiscStashHighlight:
                this.stash.highlight().pipe(
                    mergeMap(() => this.annotation.update(AnnotationCondition.MiscStashHighlightExecuted, true))
                ).subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }

    private setShouldNavigate(shouldNavigate: boolean): void {
        if (this.shouldNavigate === shouldNavigate) {
            return;
        }

        this.shouldNavigate = shouldNavigate;
        if (this.shouldNavigate) {
            this.stash.start().subscribe(
                () => { },
                error => {
                    console.warn(`Could not start the stash navigation. ${error?.message ?? JSON.stringify(error)}`, error);
                    this.notification.show('misc.start-error');
                }
            );
        } else {
            this.stash.stop().subscribe(
                () => { },
                error => {
                    console.warn(`Could not stop the stash navigation. ${error?.message ?? JSON.stringify(error)}`, error);
                    this.notification.show('misc.stop-error');
                }
            );
        }
    }
}
