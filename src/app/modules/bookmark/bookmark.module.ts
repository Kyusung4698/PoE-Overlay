import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { BookmarkSettingsComponent, BookmarkUserSettings } from './component/bookmark-settings/bookmark-settings.component';
import { BookmarkService } from './service/bookmark.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: BookmarkModule, multi: true }],
    declarations: [BookmarkSettingsComponent],
    imports: [SharedModule]
})
export class BookmarkModule implements FeatureModule {

    constructor(private readonly bookmarkService: BookmarkService) { }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: BookmarkUserSettings = {
            bookmarks: [
                {
                    url: 'https://www.poelab.com/',
                    shortcut: 'Alt + num1',
                    external: false
                },
                {
                    url: 'https://wraeclast.com/',
                    shortcut: 'Alt + num2',
                    external: false
                }
            ]
        };
        return {
            name: 'bookmark.name',
            component: BookmarkSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: BookmarkUserSettings): Feature[] {
        return settings.bookmarks
            .filter(bookmark => bookmark.url && bookmark.shortcut)
            .map((bookmark, index) => {
                const feature: Feature = {
                    name: `bookmark-${index}`,
                    accelerator: bookmark.shortcut
                };
                return feature;
            });
    }

    public run(feature: string, settings: BookmarkUserSettings): void {
        const index = +feature.split('-')[1];
        const bookmark = settings.bookmarks[index];
        this.bookmarkService.open(bookmark);
    }
}
