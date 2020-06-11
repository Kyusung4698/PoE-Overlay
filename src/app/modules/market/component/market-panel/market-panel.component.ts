import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-market-panel',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketPanelComponent {
  public active$ = new BehaviorSubject<boolean>(false);

  @Input()
  public label: string;

  @Input()
  public set active(active: boolean) {
    this.active$.next(active);
  }

  @ContentChild(TemplateRef, { read: TemplateRef, static: true })
  public explicitContent: TemplateRef<any>;

  @ViewChild(TemplateRef, { static: true })
  public implicitContent: TemplateRef<any>;

  public get content(): TemplateRef<any> {
    return this.explicitContent || this.implicitContent;
  }

  public toggle(): void {
    this.active$.next(!this.active$.value);
  }
}
