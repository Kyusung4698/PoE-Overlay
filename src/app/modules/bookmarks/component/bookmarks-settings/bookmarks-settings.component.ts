import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { BookmarksFeatureBookmark, BookmarksFeatureSettings } from '@modules/bookmarks/bookmarks-feature-settings';

@Component({
  selector: 'app-bookmarks-settings',
  templateUrl: './bookmarks-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarksSettingsComponent extends FeatureSettingsComponent<BookmarksFeatureSettings> {
  public load(): void {
  }

  public onExternalChange(bookmark: BookmarksFeatureBookmark, external: boolean): void {
    bookmark.external = external;
    this.save();
  }

  public onChange(): void {
    this.save();
  }
}
