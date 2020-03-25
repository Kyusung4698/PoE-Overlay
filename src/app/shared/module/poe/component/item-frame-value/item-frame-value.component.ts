import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemValue } from '../../type';
import { ItemFrameComponent } from '../item-frame/item-frame.component';

@Component({
  selector: 'app-item-frame-value',
  templateUrl: './item-frame-value.component.html',
  styleUrls: ['./item-frame-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe]
})
export class ItemFrameValueComponent implements OnInit {
  public default: ItemValue;

  @ViewChild('min', { static: true })
  public min: ElementRef<HTMLInputElement>;

  @ViewChild('max', { static: true })
  public max: ElementRef<HTMLInputElement>;

  @Input()
  public disabled: boolean;

  @Input()
  public modifierMinRange: number;

  @Input()
  public modifierMaxRange: number;

  @Input()
  public value: ItemValue;

  @Output()
  public valueChange = new EventEmitter<ItemValue>();

  public text$: Subject<boolean>;

  constructor(
    @Inject(ItemFrameComponent)
    private readonly itemFrame: ItemFrameComponent,
    private readonly decimal: DecimalPipe) {
    this.text$ = this.itemFrame.text$;
  }

  public ngOnInit(): void {
    if (this.itemFrame.queryItemChange.observers.length <= 0) {
      this.disabled = true;
    }
    this.init();
  }

  public onMouseDown(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }

  public onMouseUp(event: MouseEvent): void {
    event.stopImmediatePropagation();
    /* tslint:disable */
    if (event.which === 2) {
      this.resetValue(true, true);
    } else if (event.which === 3) {
      this.toggleValue(true, true);
    }
    /* tslint:enable */
  }

  public onMouseUpMin(event: MouseEvent): void {
    event.stopImmediatePropagation();
    /* tslint:disable */
    if (event.which === 2) {
      this.resetValue(true, false);
    } else if (event.which === 3) {
      this.toggleValue(true, false);
    }
    /* tslint:enable */
  }

  public onMouseUpMax(event: MouseEvent): void {
    event.stopImmediatePropagation();
    /* tslint:disable */
    if (event.which === 2) {
      this.resetValue(false, true);
    } else if (event.which === 3) {
      this.toggleValue(false, true);
    }
    /* tslint:enable */
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

  public onBlur(viewMin: string | number, viewMax: string | number): void {
    const { min, max } = this.value;

    this.value.min = +viewMin;
    this.value.max = +viewMax;

    this.clampValue();

    if (min !== this.value.min || max !== this.value.max) {
      this.emitChange();
    } else {
      this.updateView();
    }
  }

  public onKeyup(): void {
    this.updateViewWidth();
  }

  public resetValue(isMin: boolean, isMax: boolean): void {
    if (this.disabled) {
      return;
    }

    const { min, max } = this.value;
    if (isMin) {
      this.value.min = this.default.min;
    }
    if (isMax) {
      this.value.max = this.default.max;
    }
    if (min !== this.value.min || max !== this.value.max) {
      this.emitChange();
    }
  }

  public toggleValue(isMin: boolean, isMax: boolean): void {
    if (this.disabled) {
      return;
    }

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
      this.emitChange();
    }
  }

  public adjustValue(step: number, isMin: boolean, isMax: boolean): void {
    if (this.disabled) {
      return;
    }

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

    this.clampValue();

    if (min !== this.value.min || max !== this.value.max) {
      this.emitChange();
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

  private clampValue(): void {
    if (isNaN(this.value.min)) {
      this.value.min = undefined;
    }
    if (isNaN(this.value.max)) {
      this.value.max = undefined;
    }

    // stay in range
    if (this.value.min > this.default.min) {
      this.value.min = this.default.min;
    }
    if (this.value.max < this.default.max) {
      this.value.max = this.default.max;
    }

    // if positive - stay positive!
    if (this.default.min >= 0 && this.value.min < 0) {
      this.value.min = 0;
    }
    if (this.default.max > 0 && this.value.max < 0) {
      this.value.max = 0;
    }

    // if negative - stay negative!
    if (this.default.min < 0 && this.value.min > 0) {
      this.value.min = 0;
    }
    if (this.default.max <= 0 && this.value.max > 0) {
      this.value.max = 0;
    }
  }

  private init(): void {
    const value = this.parseValue(this.value.text);
    this.value.min = value;
    this.value.max = value;
    this.default = { ...this.value };

    if (this.modifierMinRange === 0.5) {
      this.value.min = undefined;
    } else {
      this.value.min -= value * this.modifierMinRange;
      if (Number.isInteger(value)) {
        this.value.min = Math.floor(this.value.min);
      } else {
        this.value.min = Math.floor(this.value.min * 10) / 10;
      }
    }

    if (this.modifierMaxRange === 0.5) {
      this.value.max = undefined;
    } else {
      this.value.max += value * this.modifierMaxRange;
      if (Number.isInteger(value)) {
        this.value.max = Math.ceil(this.value.max);
      } else {
        this.value.max = Math.ceil(this.value.max * 10) / 10;
      }
    }

    this.emitChange();
  }

  private emitChange(): void {
    this.updateView();
    this.valueChange.emit(this.value);
    this.itemFrame.onValueChange(this.value);
  }

  private updateView(): void {
    this.min.nativeElement.value = this.value.min === undefined
      ? '#' : this.decimal.transform(this.value.min, '1.0-1');
    this.max.nativeElement.value = this.value.max === undefined
      ? '#' : this.decimal.transform(this.value.max, '1.0-1');
    this.updateViewWidth();
  }

  private updateViewWidth(): void {
    this.min.nativeElement.style.width = `${this.min.nativeElement.value.length}ch`;
    this.max.nativeElement.style.width = `${this.max.nativeElement.value.length}ch`;
  }

  private parseValue(text: string): number {
    return +text.replace('%', '');
  }
}
