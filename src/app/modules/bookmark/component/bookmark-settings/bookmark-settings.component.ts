import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface BookmarkUserSettings extends UserSettings {
  bookmarks: BookmarkUserBookmark[];
}

export interface BookmarkUserBookmark {
  url: string;
  shortcut: string;
}

@Component({
  selector: 'app-bookmark-settings',
  templateUrl: './bookmark-settings.component.html',
  styleUrls: ['./bookmark-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkSettingsComponent implements UserSettingsComponent {
  public settings: BookmarkUserSettings;

  public load(): void {
    // stub
  }

  public onAddClick(): void {
    this.addBookmark();
  }

  public onRemoveClick(index: number): void {
    this.removeBookmark(index);
  }

  private addBookmark(): void {
    this.settings.bookmarks.push({
      url: 'https://github.com/Kyusung4698/PoE-Overlay',
      shortcut: undefined
    });
  }

  private removeBookmark(index: number): void {
    this.settings.bookmarks.splice(index, 1);
  }
}
