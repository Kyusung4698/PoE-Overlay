import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextService } from '../../service';
import { Item, ItemSocket, Language } from '../../type';

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
  public queryItem: Item;

  @Output()
  public queryItemChange = new EventEmitter<Item>();

  @Input()
  public language?: Language;

  @Input()
  public separator = false;

  @Input()
  public modifier = 0.1;

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

  constructor(private readonly context: ContextService) { }

  public ngOnInit(): void {
    this.language = this.language || this.context.get().language;
  }

  public onPropertyChange(): void {
    this.queryItemChange.emit(this.queryItem);
  }

  public onValueChange(value: any): void {
    if (value !== undefined) {
      this.queryItemChange.emit(this.queryItem);
    }
  }

  public toggleSocketColor(event: MouseEvent, index: number, value: ItemSocket): void {
    if (event.shiftKey) {
      const enabled = this.queryItem.sockets.every(x => x.color !== undefined);
      for (let i = 0; i < this.queryItem.sockets.length; i++) {
        this.queryItem.sockets[i].color = enabled ? undefined : this.item.sockets[i].color;
      }
    } else {
      this.queryItem.sockets[index] = this.toggleSocket(this.queryItem.sockets[index], value, 'color');
    }
    this.queryItemChange.emit(this.queryItem);
  }

  public toggleSocketLinked(event: MouseEvent, index: number, value: ItemSocket): void {
    if (event.shiftKey) {
      const enabled = this.queryItem.sockets.every(x => x.linked !== undefined);
      for (let i = 0; i < this.queryItem.sockets.length; i++) {
        this.queryItem.sockets[i].linked = enabled ? undefined : this.item.sockets[i].linked;
      }
    } else {
      this.queryItem.sockets[index] = this.toggleSocket(this.queryItem.sockets[index], value, 'linked');
    }
    this.queryItemChange.emit(this.queryItem);
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

  private toggleSocket(socket: ItemSocket, value: ItemSocket, property: string): ItemSocket {
    if (!socket || !socket[property]) {
      return { ...socket, [property]: value[property] };
    }
    return { ...socket, [property]: null };
  }
}
