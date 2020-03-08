import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame-properties',
  templateUrl: './item-frame-properties.component.html',
  styleUrls: ['./item-frame-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFramePropertiesComponent implements OnInit {
  @Input()
  public item: Item;

  @Input()
  public queryItem: Item;

  @Input()
  public language: Language;

  @Input()
  public properties: string[];

  public ngOnInit(): void {
    this.properties = this.properties || [
      'weaponCriticalStrikeChance',
      'weaponAttacksPerSecond',
      'shieldBlockChance',
      'armourArmour',
      'armourEvasionRating',
      'armourEnergyShield',
      'stackSize',
      'gemLevel',
      'mapTier',
      'mapQuantity',
      'mapRarity',
      'mapPacksize',
      'quality',
      'gemExperience',
    ];
  }
}
