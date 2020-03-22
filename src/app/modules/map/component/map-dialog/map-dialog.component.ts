import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserService } from '@app/service';
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
