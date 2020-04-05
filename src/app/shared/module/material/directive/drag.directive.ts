import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Point } from '@app/type';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective implements OnInit, OnDestroy {
  private element: HTMLElement;

  private pressed = false;
  private dragging = false;

  private pointerPosition: Point;
  private position: Point;

  @Input('appDrag')
  public rootElementSelector: string;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) { }

  public ngOnInit(): void {
    if (this.rootElementSelector) {
      this.element = getClosestMatchingAncestor(this.elementRef.nativeElement, this.rootElementSelector);
    }
    this.element = this.element || this.elementRef.nativeElement;
    this.element.addEventListener('mousedown', this.mousedown, true);
    this.element.addEventListener('mouseup', this.mouseup, true);
    this.element.addEventListener('mousemove', this.mousemove, true);
  }

  public ngOnDestroy(): void {
    this.element.removeEventListener('mousedown', this.mousedown);
    this.element.removeEventListener('mouseup', this.mouseup);
    this.element.removeEventListener('mousemove', this.mousemove);
  }

  private mousedown = (event: MouseEvent) => {
    this.pressed = true;
    this.pointerPosition = {
      x: event.pageX,
      y: event.pageY,
    };
    this.position = {
      x: +this.element.style['margin-left'].replace('px', ''),
      y: +this.element.style['margin-top'].replace('px', ''),
    };
  };

  private mouseup = () => {
    this.pressed = false;
    this.dragging = false;
  };

  private mousemove = (event: MouseEvent) => {
    if (!this.pressed) {
      return;
    }

    if (!this.dragging) {
      const distanceX = Math.abs(event.pageX - this.pointerPosition.x);
      const distanceY = Math.abs(event.pageY - this.pointerPosition.y);

      const isOverThreshold = distanceX + distanceY >= 5;
      if (isOverThreshold) {
        this.dragging = true;
      }
    }

    if (!this.dragging) {
      return;
    }

    const delta: Point = {
      x: event.pageX - this.pointerPosition.x,
      y: event.pageY - this.pointerPosition.y,
    };

    this.element.style['margin-left'] = `${this.position.x + delta.x}px`;
    this.element.style['margin-top'] = `${this.position.y + delta.y}px`;
  };
}

/** Gets the closest ancestor of an element that matches a selector. */
function getClosestMatchingAncestor(element: HTMLElement, selector: string): HTMLElement {
  let currentElement = element.parentElement as HTMLElement | null;

  while (currentElement) {
    // IE doesn't support `matches` so we have to fall back to `msMatchesSelector`.
    if (currentElement.matches ? currentElement.matches(selector) :
      (currentElement as any).msMatchesSelector(selector)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}