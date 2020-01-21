import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/* tslint:disable */
const KEY_CODES = /^(F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z])$/;
/* tslint:enable */

@Component({
  selector: 'app-accelerator',
  templateUrl: './accelerator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcceleratorComponent {
  @Input()
  public label: string;

  @Input()
  public value: string;

  @Output()
  public valueChange = new EventEmitter<string>();

  public recording = false;

  public onKeyboardClick(el: HTMLElement): void {
    this.recording = true;
    el.focus();
    this.value = 'Press any key';
  }

  public onKeydown(event: KeyboardEvent): void {
    if (this.recording) {
      let key = event.key || '';
      if (key.length === 1) {
        key = key.toUpperCase();
      }
      if (KEY_CODES.test(key)) {
        this.recording = false;

        /* tslint:disable */
        if (event.keyCode >= 96 && event.keyCode <= 105) {
          key = `num${key}`;
        }
        /* tslint:enable */

        const modifiers = [];
        if (event.ctrlKey) {
          modifiers.push('CmdOrCtrl');
        }
        if (event.altKey) {
          modifiers.push('Alt');
        }
        if (event.shiftKey) {
          modifiers.push('Shift');
        }
        modifiers.push(key);
        this.value = modifiers.join(' + ');
        this.valueChange.next(this.value);
      } else if (key === 'Esc' || key === 'Escape') {
        this.recording = false;
        this.value = undefined;
        this.valueChange.next(this.value);
      } else {
        this.value = 'Press any key';
      }
    }
  }

}
