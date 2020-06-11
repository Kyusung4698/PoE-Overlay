import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OWWindow } from '@app/odk';

@Directive({
    selector: '[appResize]'
})
export class ResizeDirective implements OnInit, OnDestroy {
    private observer: ResizeObserver;

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly ngZone: NgZone) { }

    public ngOnInit(): void {
        const window = new OWWindow();
        window.assureObtained().subscribe(() => {
            this.observer = new ResizeObserver(() => {
                this.ngZone.run(() => {
                    const { offsetWidth, offsetHeight } = this.elementRef.nativeElement;
                    window.changeSize(offsetWidth, offsetHeight).subscribe();
                });
            });
            this.observer.observe(this.elementRef.nativeElement);
        });
    }

    public ngOnDestroy(): void {
        this.observer?.unobserve(this.elementRef.nativeElement);
        this.observer?.disconnect();
    }
}
