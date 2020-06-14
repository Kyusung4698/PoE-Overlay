import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Templates {
  [index: number]: TemplateRef<any>;
}

@Component({
  selector: 'app-market-frame',
  templateUrl: './market-frame.component.html',
  styleUrls: ['./market-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketFrameComponent {
  public templates$ = new BehaviorSubject<Templates>({});
  public active$ = new BehaviorSubject<number>(0);

  @Output()
  public filterVisible = new EventEmitter<boolean>();

  @Output()
  public toggle = new EventEmitter<void>();

  @Output()
  public toggleSettings = new EventEmitter<void>();

  public onTabChange(index: number): void {
    this.active$.next(index);
    this.filterVisible.next(!!this.templates$.value[index]);
  }

  public onToggleFilter(index: number, template: TemplateRef<any>): void {
    this.templates$.value[index] = template;
    this.templates$.next(this.templates$.value);
    this.filterVisible.next(!!this.templates$.value[this.active$.value]);
  }

  public onToggle(): void {
    this.toggle.next();
  }

  public onToggleSettings(): void {
    this.toggleSettings.next();
  }
}
