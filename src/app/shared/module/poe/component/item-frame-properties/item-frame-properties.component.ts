import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame-properties',
  templateUrl: './item-frame-properties.component.html',
  styleUrls: ['./item-frame-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFramePropertiesComponent {
  @Input()
  public item: Item;

  @Input()
  public queryItem: Item;

  @Input()
  public language: Language;

  @Input()
  public properties = [
    'weaponCriticalStrikeChance',
    'weaponAttacksPerSecond',
    'shieldBlockChance',
    'armourArmour',
    'armourEvasionRating',
    'armourEnergyShield',
    'gemLevel',
    'mapTier',
    'mapQuantity',
    'mapRarity',
    'mapPacksize',
    'quality',
    'gemExperience',
  ];
}
