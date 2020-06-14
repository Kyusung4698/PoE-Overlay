import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-market-tab',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketTabComponent {
  public label$ = new BehaviorSubject<string>(undefined);

  @Input()
  public set label(label: string) {
    this.label$.next(label);
  }

  @ContentChild(TemplateRef, { read: TemplateRef, static: true })
  public explicitContent: TemplateRef<any>;

  @ViewChild(TemplateRef, { static: true })
  public implicitContent: TemplateRef<any>;

  public get content(): TemplateRef<any> {
    return this.explicitContent || this.implicitContent;
  }
}
