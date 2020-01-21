import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame-stats',
  templateUrl: './item-frame-stats.component.html',
  styleUrls: ['./item-frame-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameStatsComponent {
  @Input()
  public item: Item;

  @Input()
  public queryItem: Item;

  @Input()
  public language: Language;

  @Input()
  public modifier: number;

  @Input()
  public modifierMaxRange: boolean;
}
