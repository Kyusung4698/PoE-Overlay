import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../../type';

@Component({
  selector: 'app-item-frame-separator',
  templateUrl: './item-frame-separator.component.html',
  styleUrls: ['./item-frame-separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameSeparatorComponent {
  @Input()
  public item: Item;
}
