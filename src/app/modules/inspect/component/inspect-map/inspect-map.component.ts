import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InspectFeatureSettings } from '@modules/inspect/inspect-feature-settings';
import { Item } from '@shared/module/poe/item';
import { WikiMap, WikiMapService } from '@shared/module/poe/wiki';

@Component({
  selector: 'app-inspect-map',
  templateUrl: './inspect-map.component.html',
  styleUrls: ['./inspect-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectMapComponent implements OnInit {
  public properties = [
    'mapTier'
  ];
  public map: WikiMap;
  public layout = false;
  public bosses = false;
  public encounter = false;
  public items = false;

  @Input()
  public item: Item;

  @Input()
  public settings: InspectFeatureSettings;

  constructor(private readonly wikiMap: WikiMapService) { }

  public ngOnInit(): void {
    this.item.stats = (this.item.stats || []).filter(stat =>
      stat.id && this.settings.inspectMapStatWarning[stat.id]);
    this.map = this.wikiMap.get(this.item.typeId);
    if (this.map) {
      const { layout } = this.map;
      this.layout = !!layout;
      const { bossCount, bosses } = this.map;
      this.bosses = !!(bossCount > 0 || bosses?.length);
      const { encounter } = this.map;
      this.encounter = !!encounter;
      const { items } = this.map;
      this.items = !!items?.length;
    }
  }
}
