import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-frame-query',
  templateUrl: './item-frame-query.component.html',
  styleUrls: ['./item-frame-query.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameQueryComponent {
  /* tslint:disable */
  private _value: any;
  /* tslint:enable */

  @Input()
  public property: any;

  @Output()
  public propertyChange = new EventEmitter<any>();

  @Input()
  public set value(value: any) {
    this._value = value;
    if (this.property) {
      this.property = value;
      this.propertyChange.emit(this.property);
    }
  }

  public onQueryToggleClick(): void {
    if (this.property) {
      this.property = undefined;
    } else {
      this.property = this._value;
    }
    this.propertyChange.emit(this.property);
  }
}
