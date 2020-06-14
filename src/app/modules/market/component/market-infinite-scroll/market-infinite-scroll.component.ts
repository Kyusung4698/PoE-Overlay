import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-market-infinite-scroll',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInfiniteScrollComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver;

  @Input()
  public root: HTMLElement;

  @Output()
  public visible = new EventEmitter<void>();

  constructor(private readonly ref: ElementRef) { }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.visible.next();
          this.observer.disconnect();
          this.observer = undefined;
        }
      }, {
        root: this.root,
        threshold: 1
      });
      this.observer.observe(this.ref.nativeElement);
    });
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
