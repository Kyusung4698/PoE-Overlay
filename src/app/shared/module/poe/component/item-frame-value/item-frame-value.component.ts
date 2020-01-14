import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemValue } from '../../type';

@Component({
  selector: 'app-item-frame-value',
  templateUrl: './item-frame-value.component.html',
  styleUrls: ['./item-frame-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameValueComponent implements OnInit {
  public default: ItemValue;

  @Input()
  public modifier: number = 0.1;

  @Input()
  public value: ItemValue;

  @Output()
  public valueChange = new EventEmitter<ItemValue>();

  public ngOnInit(): void {
    const value = this.parseValue(this.value.text);
    this.value.min = value;
    this.value.max = value;
    this.default = { ...this.value };
    this.adjustValue(Math.round(value * this.modifier), true, true);
  }

  public onMouseUp(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (event.which === 2 || event.which === 3) {
      this.reset();
    }
  }

  public onWheel(event: WheelEvent): void {
    event.stopImmediatePropagation();
    this.adjustValue(this.getStepFromEvent(event), true, true);
  }

  public onWheelMin(event: WheelEvent): void {
    event.stopImmediatePropagation();
    this.adjustValue(this.getStepFromEvent(event), true, false);
  }

  public onWheelMax(event: WheelEvent): void {
    event.stopImmediatePropagation();
    this.adjustValue(this.getStepFromEvent(event), false, true);
  }

  public reset(): void {
    const { min, max } = this.value;
    this.value = {
      ...this.default,
    };
    if (min !== this.value.min || max !== this.value.max) {
      this.valueChange.emit(this.value);
    }
  }

  public adjustValue(step: number, isMin: boolean, isMax: boolean): void {
    const { min, max } = this.value;
    if (isMin) {
      this.value.min -= step;
    }
    if (isMax) {
      this.value.max += step;
    }

    // stay in range
    if (this.value.min > this.default.min) {
      this.value.min = this.default.min;
    }
    if (this.value.max < this.default.max) {
      this.value.max = this.default.max;
    }

    // if positive - stay positive!
    if (min >= 0 && this.value.min < 0) {
      this.value.min = min;
    }
    if (max > 0 && this.value.max < 0) {
      this.value.max = max;
    }

    // if negative - stay negative!
    if (min < 0 && this.value.min > 0) {
      this.value.min = min;
    }
    if (max <= 0 && this.value.max > 0) {
      this.value.max = max;
    }

    if (min !== this.value.min || max !== this.value.max) {
      this.valueChange.emit(this.value);
    }
  }

  public getStepFromEvent(event: WheelEvent): number {
    let step = 1;
    if (event.altKey) {
      step = 0.1;
    }
    else if (event.shiftKey) {
      step = 5;
    }

    if (event.deltaY < 0) {
      step *= -1;
    }
    return step;
  }

  private parseValue(text: string): number {
    return +text.replace('%', '');
  }
}
