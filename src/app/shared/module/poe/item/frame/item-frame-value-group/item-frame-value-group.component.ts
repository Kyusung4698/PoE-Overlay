import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';
import { ItemFrameValueComponent } from '../item-frame-value/item-frame-value.component';

@Component({
  selector: 'app-item-frame-value-group',
  templateUrl: './item-frame-value-group.component.html',
  styleUrls: ['./item-frame-value-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameValueGroupComponent implements AfterViewInit {
  private children: ItemFrameValueComponent[];

  @ContentChildren(ItemFrameValueComponent, { descendants: true })
  public values: QueryList<ItemFrameValueComponent>;

  public ngAfterViewInit(): void {
    this.children = this.values.toArray();
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  public onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    /* tslint:disable */
    if (event.which === 2) {
      this.children.forEach(x => x.resetValue(true, true));
    } else if (event.which === 3) {
      this.children.forEach(x => x.toggleValue(true, true));
    }
    /* tslint:enable */
  }

  public onWheel(event: WheelEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.children.forEach(x => x.adjustValue(x.getStepFromEvent(event), true, true));
  }
}
