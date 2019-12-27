import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item, ItemRarity } from '../../type';

@Component({
  selector: 'app-item-frame',
  templateUrl: './item-frame.component.html',
  styleUrls: ['./item-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameComponent {
  @Input()
  public item: Item;

  @Input()
  public separator: boolean;
}
