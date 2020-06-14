import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { DBItemService } from '@shared/module/poe/db';
import { Item } from '@shared/module/poe/item';
import { WikiItemService } from '@shared/module/poe/wiki';

@Component({
  selector: 'app-inspect-links',
  templateUrl: './inspect-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectLinksComponent {
  @Input()
  public item: Item;

  constructor(
    private readonly wikiItemService: WikiItemService,
    private readonly dbItemService: DBItemService) { }

  public onWikiClick(event: MouseEvent): void {
    const url = this.wikiItemService.getUrl(this.item);
    OWUtils.openUrl(url, event.ctrlKey);
  }

  public onDBClick(event: MouseEvent): void {
    const url = this.dbItemService.getUrl(this.item);
    OWUtils.openUrl(url, event.ctrlKey);
  }
}
