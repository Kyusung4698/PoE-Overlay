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

  public getSocketTop(index: number, offset: number = 0): string {
    return `${Math.floor(index / 2) * 56 + offset}px`;
  }

  public getSocketHeight(): string {
    const length = this.item.sockets.length;
    const socketHeight = Math.floor((length + 1) / 2) * 34;
    const linkHeight = length >= 3
      ? Math.floor((length - 1) / 2) * 22
      : 0;
    return `${socketHeight + linkHeight}px`;
  }
}
