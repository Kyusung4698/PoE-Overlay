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
  public modifier: number;

  @Input()
  public modifierMaxRange: boolean;

  @Input()
  public value: ItemValue;

  @Output()
  public valueChange = new EventEmitter<ItemValue>();

  public ngOnInit(): void {
    const value = this.parseValue(this.value.text);
    this.value.min = value;
    this.value.max = value;
    this.default = { ...this.value };
    if (!this.modifierMaxRange) {
      this.value.max = undefined;
    }
    this.adjustValue(Math.round(value * this.modifier), true, true);
  }

  public onMouseUp(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (event.which === 2) {
      this.resetValue(true, true);
    } else if (event.which === 3) {
      this.toggleValue(true, true);
    }
  }

  public onMouseUpMin(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (event.which === 2) {
      this.resetValue(true, false);
    } else if (event.which === 3) {
      this.toggleValue(true, false);
    }
  }

  public onMouseUpMax(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (event.which === 2) {
      this.resetValue(false, true);
    } else if (event.which === 3) {
      this.toggleValue(false, true);
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

  public resetValue(isMin: boolean, isMax: boolean): void {
    const { min, max } = this.value;
    if (isMin) {
      this.value.min = this.default.min;
    }
    if (isMax) {
      this.value.max = this.default.max;
    }
    if (min !== this.value.min || max !== this.value.max) {
      this.valueChange.emit(this.value);
    }
  }

  public toggleValue(isMin: boolean, isMax: boolean): void {
    const { min, max } = this.value;

    if (isMin && isMax) {
      if (this.value.min === undefined || this.value.max === undefined) {
        this.value = {
          ...this.default,
        };
      } else {
        this.value.min = this.value.max = undefined;
      }
    } else {
      if (isMin) {
        this.value.min = this.value.min === undefined ? this.default.min : undefined;
      }
      if (isMax) {
        this.value.max = this.value.max === undefined ? this.default.max : undefined;
      }
    }

    if (min !== this.value.min || max !== this.value.max) {
      this.valueChange.emit(this.value);
    }
  }

  public adjustValue(step: number, isMin: boolean, isMax: boolean): void {
    const { min, max } = this.value;

    if (isMin && !isMax) {
      step *= -1;
    }

    if (isMin && this.value.min !== undefined) {
      this.value.min -= step;
    }
    if (isMax && this.value.max !== undefined) {
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
    } else if (event.shiftKey) {
      step = 5;
    }

    if (event.deltaY > 0) {
      step *= -1;
    }
    return step;
  }

  private parseValue(text: string): number {
    return +text.replace('%', '');
  }
}
