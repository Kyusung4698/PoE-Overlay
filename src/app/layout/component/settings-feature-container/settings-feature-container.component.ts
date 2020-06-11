import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, Type, ViewContainerRef } from '@angular/core';
import { FeatureSettings, FeatureSettingsComponent } from '@app/feature';

@Component({
  selector: 'app-settings-feature-container',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsFeatureContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  private componentRef: ComponentRef<FeatureSettingsComponent<FeatureSettings>>;

  @Input()
  public component: Type<FeatureSettingsComponent<FeatureSettings>>;

  @Input()
  public settings: FeatureSettings;

  @Output()
  public settingsChange = new EventEmitter<FeatureSettings>();

  public get instance(): FeatureSettingsComponent<FeatureSettings> {
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
    this.instance.save = () => this.settingsChange.next(this.settings);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.instance.load());
  }

  public ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
