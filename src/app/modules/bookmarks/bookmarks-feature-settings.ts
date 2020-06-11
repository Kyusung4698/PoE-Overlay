import { Hotkey } from '@app/config';
import { FeatureSettings } from '@app/feature';

export interface BookmarksFeatureSettings extends FeatureSettings {
    bookmarks: BookmarksFeatureBookmark[];
}

export interface BookmarksFeatureBookmark {
    url: string;
    hotkey: Hotkey;
    external: boolean;
}
