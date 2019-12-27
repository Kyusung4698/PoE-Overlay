import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ShortcutService, WindowService } from '@app/service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service/context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly shortcut: ShortcutService,
    private readonly context: ContextService,
    private readonly window: WindowService) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.cleanup();
  }

  public ngOnInit(): void {
    this.context.init();
    this.register();
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }

  private register(): void {
    this.modules.forEach(x => {
      const features = x.getFeatures();
      features.forEach(feature => {
        this.shortcut.register(feature.defaultShortcut).subscribe(() => {
          x.run(feature.name);
        });
      });
    });

    this.shortcut.register('F5').subscribe(() => {
      this.window.alwaysTop();
    });
  }

  private cleanup(): void {
    this.shortcut.cleanup();
  }
}
