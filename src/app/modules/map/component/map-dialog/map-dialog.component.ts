import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowService, BrowserService } from '@app/service';
import { MapsService } from '@shared/module/poe/service/maps/maps.service';
import { AtlasMap, Item } from '@shared/module/poe/type';
import { MapUserSettings } from '../map-settings/map-settings.component';

export interface MapDialogData {
  item: Item;
  settings: MapUserSettings;
}

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapDialogComponent implements OnInit {
  public properties = [
    'mapTier'
  ];
  public layoutRatingText =
    'A: The map has a consistent layout that can be reliably fully cleared with no backtracking.\n' +
    'B: The map has an open layout with few obstacles, or has only short and well-connected side paths.\n' +
    'C: The map has an open layout with many obstacles, or has long side paths that require backtracking.';

  public bossRatingText =
    '5: High and consistent damage output that is difficult to reliably avoid; skipped by many players.\n' +
    '4: High and consistent damage output that can be avoided reasonably well but still very dangerous.\n' +
    '3: Occasionally high damage output that can be avoided reasonably well.\n' +
    '2: Moderate damage output that can be easily kited and/or reasonably mitigated by most builds.\n' +
    '1: Trivial for most builds.';

  public map: AtlasMap;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: MapDialogData,
    private readonly browser: BrowserService,
    private readonly mapsService: MapsService) { }

  public ngOnInit(): void {
    this.data.item.stats = (this.data.item.stats || []).filter(stat =>
      stat.id && this.data.settings.mapInfoWarningStats[stat.id]);
    this.map = this.mapsService.get(this.data.item.typeId);
  }

  public onMapClick(event: MouseEvent): void {
    if (this.map && this.map.url) {
      this.browser.open(this.map.url, event.ctrlKey);
    }
  }
}
