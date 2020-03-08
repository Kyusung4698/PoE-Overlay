import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame-influences',
  templateUrl: './item-frame-influences.component.html',
  styleUrls: ['./item-frame-influences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameInfluencesComponent {
  @Input()
  public item: Item;

  @Input()
  public queryItem: Item;

  @Input()
  public language: Language;
}
