import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ItemFrameComponent } from '../item-frame/item-frame.component';

@Component({
  selector: 'app-item-frame-query',
  templateUrl: './item-frame-query.component.html',
  styleUrls: ['./item-frame-query.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameQueryComponent implements OnInit {
  private _value: any;

  @Input()
  public disabled: boolean;

  @Input()
  public property: any;

  @Output()
  public propertyChange = new EventEmitter<any>();

  constructor(
    @Inject(ItemFrameComponent)
    private readonly itemFrame: ItemFrameComponent) {
  }

  public ngOnInit(): void {
    if (this.itemFrame.queryItemChange.observers.length <= 0) {
      this.disabled = true;
    }
  }

  @Input()
  public set value(value: any) {
    this._value = value;
    if (this.property) {
      this.property = value;
      this.emitChange();
    }
  }

  public onQueryToggleClick(event: MouseEvent): void {
    const target = event.target as HTMLInputElement;
    if (target.type) {
      return;
    }

    if (this.property) {
      this.property = undefined;
    } else {
      this.property = this._value;
    }
    this.emitChange();
  }

  public checkChange(): void {
    if (this.property) {
      this.emitChange();
    }
  }

  private emitChange(): void {
    this.propertyChange.emit(this.property);
    this.itemFrame.onPropertyChange();
  }
}
