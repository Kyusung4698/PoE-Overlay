import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-frame-query',
  templateUrl: './item-frame-query.component.html',
  styleUrls: ['./item-frame-query.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameQueryComponent {
  @Input()
  public property: any;

  @Output()
  public propertyChange = new EventEmitter<any>();

  @Input()
  public value: any;

  public onQueryToggleClick(): void {
    if (this.property) {
      this.property = undefined;
    } else {
      this.property = this.value;
    }
    this.propertyChange.emit(this.property);
  }
}
