import { DragDirective } from './drag.directive';
import { ElementRef } from '@angular/core';

describe('DragDirective', () => {
  it('should create an instance', () => {
    const directive = new DragDirective(new ElementRef<HTMLElement>(document.createElement('div')));
    expect(directive).toBeTruthy();
  });
});
