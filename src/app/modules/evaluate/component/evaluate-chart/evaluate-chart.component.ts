import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ItemSearchEvaluateResult } from '@shared/module/poe/type';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-evaluate-chart',
  templateUrl: './evaluate-chart.component.html',
  styleUrls: ['./evaluate-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateChartComponent implements OnInit {
  public items: any[];
  public view = [376, 200];
  public scheme = colorSets.find(x => x.name === 'nightLights');

  @HostBinding('style.width')
  public width = `${this.view[0]}px`;

  @HostBinding('style.height')
  public height = `${this.view[1]}px`;

  @HostBinding('style.display')
  public display = 'block';

  @Input()
  public result: ItemSearchEvaluateResult;

  public ngOnInit(): void {
    if (this.result.items.length <= 2) {
      this.display = 'none';
      return;
    }
    const sortedItems = this.result.items
      .map(x => {
        const val = x.targetCurrencyAmount;
        if (val <= 1) {
          return Math.round(val * 4) / 4;
        } else if (val <= 25) {
          return Math.round(val);
        }
        return Math.round(val / 5) * 5;
      })
      .sort((a, b) => a - b);

    this.items = [{ name: sortedItems[0], value: 1 }];

    for (const item of sortedItems) {
      const index = this.items.length - 1;
      if (this.items[index].name === item) {
        ++this.items[index].value;
      } else {
        this.items.push({
          name: item,
          value: 1
        });
      }
    }

    if (this.items.length <= 2) {
      this.display = 'none';
    }
  }

}
