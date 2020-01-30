import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ItemSearchEvaluateResult } from '@shared/module/poe/type';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-evaluate-chart',
  templateUrl: './evaluate-chart.component.html',
  styleUrls: ['./evaluate-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateChartComponent {
  public items: any[];
  public total: number;
  public view = [376 + 20, 200];
  public scheme = colorSets.find(x => x.name === 'nightLights');

  @HostBinding('style.width')
  public width = `${this.view[0]}px`;

  @HostBinding('style.height')
  public height = `${this.view[1]}px`;

  @HostBinding('style.display')
  public display = 'block';

  @Input()
  public set result(result: ItemSearchEvaluateResult) {
    this.update(result);
  }

  @Output()
  public amountSelect = new EventEmitter<number>();

  public onSelect(event: { name: number }): void {
    this.amountSelect.emit(event.name);
  }

  private update(result: ItemSearchEvaluateResult): void {
    if (!result.itemsGrouped) {
      this.display = 'none';
      this.items = [];
    } else {
      this.display = 'block';
      this.total = result.total;
      this.items = result.itemsGrouped.map(x => {
        return {
          name: x.value,
          value: x.items.length
        };
      });
    }
  }
}
