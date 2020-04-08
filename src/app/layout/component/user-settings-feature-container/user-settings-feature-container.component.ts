import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, Type, ViewContainerRef } from '@angular/core';
import { UserSettings, UserSettingsComponent } from '../../type';

@Component({
  selector: 'app-user-settings-feature-container',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsFeatureContainerComponent
  implements OnInit, OnDestroy {
  private componentRef: ComponentRef<UserSettingsComponent>;

  @Input()
  public component: Type<UserSettingsComponent>;

  @Input()
  public settings: UserSettings;

  public get instance(): UserSettingsComponent {
    return this.componentRef ? this.componentRef.instance : null;
  }

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver
  ) { }

  public ngOnInit(): void {
    if (!this.component) {
      return;
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(
      this.component
    );
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(factory);
    this.instance.settings = this.settings;
    this.instance.load();
  }

  public ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
