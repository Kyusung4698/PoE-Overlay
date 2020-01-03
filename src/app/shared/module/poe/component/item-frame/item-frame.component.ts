import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ContextService } from '../../service';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame',
  templateUrl: './item-frame.component.html',
  styleUrls: ['./item-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameComponent implements OnInit {
  @Input()
  public item: Item;

  @Input()
  public language?: Language;

  @Input()
  public separator = false;

  // TODO: check if order is right
  public properties = [
    'weaponPhysicalDamage',
    'weaponElementalDamage',
    'weaponChaosDamage',
    'weaponCriticalStrikeChance',
    'weaponAttacksPerSecond',
    'weaponRange',
    'shieldBlockChance',
    'armourArmour',
    'armourEvasionRating',
    'armourEnergyShield',
  ];

  constructor(private readonly context: ContextService) { }

  public ngOnInit(): void {
    this.language = this.language || this.context.get().language;
  }
}
