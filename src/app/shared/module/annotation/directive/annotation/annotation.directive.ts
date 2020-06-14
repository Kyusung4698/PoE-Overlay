import { AfterViewInit, ChangeDetectorRef, Directive, HostBinding, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AnnotationMessage, AnnotationService } from '@app/annotation';
import { EventSubscription } from '@app/event';

@Directive({
    selector: '[appAnnotation]',
})
export class AnnotationDirective implements OnInit, AfterViewInit, OnDestroy {
    private subscription: EventSubscription;

    @Input()
    public appAnnotation: string;

    @HostBinding('class.annotation-highlight')
    public highlight: boolean;

    constructor(
        private readonly annotation: AnnotationService,
        private readonly ngZone: NgZone,
        private readonly ref: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.subscription = this.annotation.message$.on(message => {
            this.ngZone.run(() => this.updateClass(message));
        });
    }

    public ngAfterViewInit(): void {
        setTimeout(() => this.updateClass(this.annotation.message$.get()));
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private updateClass(message: AnnotationMessage): void {
        this.highlight = message?.id === this.appAnnotation;
        this.ref.markForCheck();
    }
}
