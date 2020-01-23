import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { MiscSettingsComponent, MiscUserSettings } from './component';
import { StashService } from './service/stash.service';
import { WikiService } from './service/wiki.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MiscModule, multi: true }],
    declarations: [MiscSettingsComponent],
    entryComponents: [MiscSettingsComponent],
    imports: [SharedModule]
})
export class MiscModule implements FeatureModule {

    constructor(
        private readonly stash: StashService,
        private readonly wiki: WikiService) { }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: MiscUserSettings = {
            miscStashNavigation: true,
            miscStashHighlight: true,
            miscWikiKeybinding: 'Alt + W',
            miscWikiExternalKeybinding: 'CmdOrCtrl + Alt + W',
        };
        return {
            name: 'Misc',
            component: MiscSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: MiscUserSettings): Feature[] {
        const features: Feature[] = [
            {
                name: 'wiki-open',
                shortcut: settings.miscWikiKeybinding,
            },
            {
                name: 'wiki-open-external',
                shortcut: settings.miscWikiExternalKeybinding,
            },
        ];

        if (settings.miscStashNavigation) {
            features.push({
                name: 'stash-left',
                shortcut: 'CmdOrCtrl + MouseWheelUp'
            });
            features.push({
                name: 'stash-right',
                shortcut: 'CmdOrCtrl + MouseWheelDown'
            });
        }

        if (settings.miscStashHighlight) {
            features.push({
                name: 'stash-highlight',
                shortcut: 'CmdOrCtrl + F'
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
            default:
                break;
        }
    }
}
