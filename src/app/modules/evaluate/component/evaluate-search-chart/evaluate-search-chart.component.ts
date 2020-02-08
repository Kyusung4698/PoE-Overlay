import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ItemSearchAnalyzeResult, SearchAnalyzeEntryGrouped } from '@shared/module/poe/service';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-evaluate-search-chart',
  templateUrl: './evaluate-search-chart.component.html',
  styleUrls: ['./evaluate-search-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSearchChartComponent {
  public items: any[];
  public total: number;
  public view = [376 + 20, 200];
  public scheme = colorSets.find(x => x.name === 'nightLights');
  public groups: {
    [value: number]: SearchAnalyzeEntryGrouped
  } = {};
  public xAxisTickFormatting = this.format.bind(this);

  @HostBinding('style.width')
  public width = `${this.view[0]}px`;

  @HostBinding('style.height')
  public height = `${this.view[1]}px`;

  @HostBinding('style.display')
  public display = 'block';

  @Input()
  public set result(result: ItemSearchAnalyzeResult) {
    this.update(result);
  }

  @Output()
  public amountSelect = new EventEmitter<number>();

  public onSelect(event: { name: number }): void {
    this.amountSelect.emit(event.name);
  }

  public format(value: number): string {
    const group = this.groups[value];
    const length = group.items.length + group.hidden;
    const hidden = group.hidden;
    if (hidden >= length * 0.75) {
      return `${value}***`;
    } else if (hidden >= length * 0.50) {
      return `${value}**`;
    } else if (hidden >= length * 0.25) {
      return `${value}*`;
    }
    return `${value}`;
  }

  private update(result: ItemSearchAnalyzeResult): void {
    if (!result.itemsGrouped) {
      this.display = 'none';
      this.items = [];
    } else {
      this.display = 'block';
      this.total = result.total;
      this.groups = {};
      this.items = result.itemsGrouped.map(x => {
        this.groups[x.value] = x;
        return { name: x.value, value: x.items.length };
      });
    }
  }
}
