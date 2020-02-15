import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { MiscSettingsComponent, MiscUserSettings } from './component';
import { MiscPoedbService } from './service/misc-poedb.service';
import { MiscStashService } from './service/misc-stash.service';
import { MiscWikiService } from './service/misc-wiki.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MiscModule, multi: true }],
    declarations: [MiscSettingsComponent],
    imports: [SharedModule]
})
export class MiscModule implements FeatureModule {

    constructor(
        private readonly stash: MiscStashService,
        private readonly wiki: MiscWikiService,
        private readonly poedb: MiscPoedbService) { }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: MiscUserSettings = {
            miscStashNavigation: true,
            miscStashHighlight: true,
            miscWikiKeybinding: 'Alt + W',
            miscWikiExternalKeybinding: 'CmdOrCtrl + Alt + W',
            miscPoedbKeybinding: 'Alt + G',
            miscPoedbExternalKeybinding: 'CmdOrCtrl + Alt + G',
        };
        return {
            name: 'misc.name',
            component: MiscSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: MiscUserSettings): Feature[] {
        const features: Feature[] = [
            {
                name: 'wiki-open',
                accelerator: settings.miscWikiKeybinding,
            },
            {
                name: 'wiki-open-external',
                accelerator: settings.miscWikiExternalKeybinding,
            },
            {
                name: 'poedb-open',
                accelerator: settings.miscPoedbKeybinding,
            },
            {
                name: 'poedb-open-external',
                accelerator: settings.miscPoedbExternalKeybinding,
            },
        ];

        if (settings.miscStashNavigation) {
            features.push({
                name: 'stash-left',
                accelerator: 'CmdOrCtrl + MouseWheelUp',
                passive: true
            });
            features.push({
                name: 'stash-right',
                accelerator: 'CmdOrCtrl + MouseWheelDown',
                passive: true
            });
        }

        if (settings.miscStashHighlight) {
            features.push({
                name: 'stash-highlight',
                accelerator: 'Alt + F'
            });
        }

        return features;
    }

    public run(feature: string, _: MiscUserSettings): void {
        switch (feature) {
            case 'stash-left':
            case 'stash-right':
                this.stash.navigate(feature);
                break;
            case 'stash-highlight':
                this.stash.highlight();
                break;
            case 'wiki-open':
            case 'wiki-open-external':
                this.wiki.open(feature === 'wiki-open-external').subscribe();
                break;
            case 'poedb-open':
            case 'poedb-open-external':
                this.poedb.open(feature === 'poedb-open-external').subscribe();
                break;
            default:
                break;
        }
    }
}
