import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ItemCategory } from '../../base-item-type';
import { Item } from '../../item';

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

  @Input()
  public minRange: number;

  @Input()
  public maxRange: number;

  public isWeapon: boolean;
  public isArmour: boolean;

  public ngOnInit(): void {
    this.properties = this.properties || [
      'weaponCriticalStrikeChance',
      'weaponAttacksPerSecond',
      'weaponRange',
      'shieldBlockChance',
      'armourArmour',
      'armourEvasionRating',
      'armourEnergyShield',
      'stackSize',
      'gemLevel',
      'heistAreaLevel',
      'heistWingsRevealed',
      'heistEscapeRoutesRevealed',
      'heistSecretRewardRoomsRevealed',
      'mapTier',
      'mapQuantity',
      'mapRarity',
      'mapPacksize',
      'quality',
      'heistReinforcements',
      'gemExperience',
    ];
    this.isArmour = this.item.category.startsWith(ItemCategory.Armour);
    this.isWeapon = this.item.category.startsWith(ItemCategory.Weapon);
  }
}
