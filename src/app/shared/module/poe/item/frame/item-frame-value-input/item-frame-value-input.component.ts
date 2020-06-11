import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-item-frame-value-input',
  templateUrl: './item-frame-value-input.component.html',
  styleUrls: ['./item-frame-value-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe]
})
export class ItemFrameValueInputComponent {
  private _value: number;

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement>;

  public get value(): number {
    return this._value;
  }

  @Input()
  public set value(value: number) {
    this._value = value === undefined
      ? undefined
      : Math.round(value * 10) / 10;
    this.update();
  }

  @Output()
  public valueChange = new EventEmitter<number>();

  @Output()
  public focusChange = new EventEmitter<boolean>();

  constructor(private readonly decimal: DecimalPipe) { }

  public onKeyUp(): void {
    this.updateViewWidth();
  }

  public onFocus(): void {
    this.update(false);
    this.focusChange.next(true);
  }

  public onBlur(): void {
    const value = +this.input.nativeElement.value;
    this.value = isNaN(value) ? undefined : value;
    this.valueChange.next(this.value);
    this.focusChange.next(false);
  }

  private update(transformed = true): void {
    this.updateViewValue(transformed);
    this.updateViewWidth();
  }

  private updateViewValue(transformed: boolean): void {
    if (this.value === undefined) {
      this.input.nativeElement.value = '#';
    } else {
      this.input.nativeElement.value = transformed
        ? this.decimal.transform(this.value, '1.0-1')
        : `${this.value || ''}`;
    }
  }

  private updateViewWidth(): void {
    const value = this.input.nativeElement.value;
    const valueCharCount = value.length
      - ((value.split('.').length - 1) * 0.5)
      - ((value.split(',').length - 1) * 0.5);
    this.input.nativeElement.style.width = `${valueCharCount}ch`;
  }
}
