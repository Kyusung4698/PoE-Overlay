import { AfterViewInit, ChangeDetectorRef, Directive, HostBinding, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AnnotationService } from '@app/annotation';
import { EventSubscription } from '@app/event';

@Directive({
    selector: '[appAnnotation]',
})
export class AnnotationDirective implements OnInit, AfterViewInit, OnDestroy {
    private subscription: EventSubscription;

    private currentId: string;
    private expectedId: string;

    @Input()
    public set appAnnotation(annotation: string) {
        this.expectedId = annotation;
        this.updateHighlight();
    }

    @HostBinding('class.annotation-highlight')
    public highlight: boolean;

    constructor(
        private readonly annotation: AnnotationService,
        private readonly ngZone: NgZone,
        private readonly ref: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.subscription = this.annotation.message$.on(message => {
            this.currentId = message?.id;
            this.ngZone.run(() => this.updateHighlight());
        });
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            const message = this.annotation.message$.get();
            this.currentId = message?.id;
            this.updateHighlight();
        });
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private updateHighlight(): void {
        this.highlight = this.currentId === this.expectedId;
        this.ref.markForCheck();
    }
}
