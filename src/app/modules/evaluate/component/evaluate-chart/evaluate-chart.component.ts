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
  public view = [376 + 20, 200];
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
    if (!this.result.itemsGrouped || this.result.itemsGrouped.length < 2) {
      this.display = 'none';
      return;
    }

    this.items = this.result.itemsGrouped.map(x => {
      return {
        name: x.value,
        value: x.items.length
      };
    });
  }
}
