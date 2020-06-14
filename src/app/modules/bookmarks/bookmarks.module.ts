import { NgModule } from '@angular/core';
import { AnnotationService, AnnotationCondition } from '@app/annotation';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { SharedModule } from '@shared/shared.module';
import { BookmarksFeatureSettings } from './bookmarks-feature-settings';
import { BookmarksSettingsComponent } from './component';
import { BookmarkService } from './service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: BookmarksModule, multi: true }],
    declarations: [
        BookmarksSettingsComponent
    ],
    imports: [SharedModule]
})
export class BookmarksModule implements FeatureModule<BookmarksFeatureSettings> {

    constructor(
        private readonly bookmark: BookmarkService,
        private readonly annotation: AnnotationService) { }

    public getConfig(): FeatureConfig<BookmarksFeatureSettings> {
        const config: FeatureConfig<BookmarksFeatureSettings> = {
            name: 'bookmarks.name',
            component: BookmarksSettingsComponent,
            default: {
                bookmarks: [
                    {
                        hotkey: Hotkey.Bookmark1,
                        url: 'https://poe.ninja/',
                        external: false
                    },
                    {
                        hotkey: Hotkey.Bookmark2,
                        url: 'https://www.poelab.com/',
                        external: false
                    },
                    {
                        hotkey: Hotkey.Bookmark3,
                        url: 'https://wraeclast.com/',
                        external: false
                    },
                    {
                        hotkey: Hotkey.Bookmark4,
                        url: '',
                        external: false
                    },
                    {
                        hotkey: Hotkey.Bookmark5,
                        url: '',
                        external: false
                    },
                    {
                        hotkey: Hotkey.Bookmark6,
                        url: '',
                        external: false
                    }
                ]
            },
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.Bookmark1 },
            { hotkey: Hotkey.Bookmark2 },
            { hotkey: Hotkey.Bookmark3 },
            { hotkey: Hotkey.Bookmark4 },
            { hotkey: Hotkey.Bookmark5 },
            { hotkey: Hotkey.Bookmark6 },
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey, settings: BookmarksFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.Bookmark1:
            case Hotkey.Bookmark2:
            case Hotkey.Bookmark3:
            case Hotkey.Bookmark4:
            case Hotkey.Bookmark5:
            case Hotkey.Bookmark6:
                const index = +hotkey.replace('bookmark', '');
                const { url, external } = settings.bookmarks[index - 1];
                if (url?.length) {
                    this.bookmark.open(url, external);
                }
                this.annotation.update(AnnotationCondition.BookmarkOpened, true).subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }
}
