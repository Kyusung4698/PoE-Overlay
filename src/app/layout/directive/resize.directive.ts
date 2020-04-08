import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { WindowService } from '@app/service';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit, OnDestroy {
  private readonly observer: ResizeObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly window: WindowService,
    private readonly ngZone: NgZone) {
    this.observer = new ResizeObserver(() => {
      this.ngZone.run(() => {
        const { offsetWidth, offsetHeight } = this.elementRef.nativeElement;
        this.window.setSize(offsetWidth, offsetHeight);
      });
    });
  }

  public ngOnInit(): void {
    this.observer.observe(this.elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.unobserve(this.elementRef.nativeElement);
    this.observer.disconnect();
  }
}
