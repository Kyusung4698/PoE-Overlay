import { ChangeDetectionStrategy, Component, HostBinding, HostListener } from '@angular/core';
import { SettingsFeature, SettingsWindowService } from '@layout/service';
import { MarketWindowService } from '@modules/market/service';

@Component({
  selector: 'app-market-window',
  templateUrl: './market-window.component.html',
  styleUrls: ['./market-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketWindowComponent {
  constructor(
    private readonly marketWindow: MarketWindowService,
    private readonly settings: SettingsWindowService) { }

  @HostBinding('class.filter-visible')
  public visible = false;

  @HostListener('document:keydown.escape')
  public onKeydownHandler(): void {
    this.marketWindow.toggle().subscribe();
  }

  public onFilterVisible(visible: boolean): void {
    this.visible = visible;
  }

  public onToggle(): void {
    this.marketWindow.toggle().subscribe();
  }

  public onToggleSettings(): void {
    this.settings.toggle(SettingsFeature.Market).subscribe();
  }
}
