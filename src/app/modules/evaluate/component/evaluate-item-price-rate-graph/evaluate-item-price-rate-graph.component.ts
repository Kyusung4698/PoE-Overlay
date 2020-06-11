import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ItemPriceRateResult } from '@shared/module/poe/price';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-evaluate-item-price-rate-graph',
  templateUrl: './evaluate-item-price-rate-graph.component.html',
  styleUrls: ['./evaluate-item-price-rate-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPriceRateGraphComponent {
  private _rate: ItemPriceRateResult;
  private _inverse: boolean;
  private _name: string;

  public items: any[];
  public view = [140, 60];
  public scheme = {
    name: 'nightLights',
    selectable: false,
    group: 'Ordinal',
    domain: [
      '#4e31a5',
      '#9c25a7',
      '#3065ab',
      '#57468b',
      '#904497',
      '#46648b',
      '#32118d',
      '#a00fb3',
      '#1052a2',
      '#6e51bd',
      '#b63cc3',
      '#6c97cb',
      '#8671c1',
      '#b455be',
      '#7496c3'
    ]
  };

  public curve = shape.curveNatural;
  public yScaleMin = 0;
  public yScaleMax = 0;

  @HostBinding('style.width')
  public width = `${this.view[0] - 30}px`;

  @HostBinding('style.height')
  public height = `${this.view[1] - 20}px`;

  @HostBinding('style.display')
  public display = 'inline-block';

  @Input()
  public set rate(rate: ItemPriceRateResult) {
    this._rate = rate;
    this.update();
  }

  public get rate(): ItemPriceRateResult {
    return this._rate;
  }

  @Input()
  public set inverse(inverse: boolean) {
    this._inverse = inverse;
    this.update();
  }

  public get inverse(): boolean {
    return this._inverse;
  }

  @Input()
  public set name(name: string) {
    this._name = name;
    this.update();
  }

  public get name(): string {
    return this._name;
  }

  private update(): void {
    if (!this.rate.history || !this.name) {
      this.display = 'none';
      return;
    } else {
      this.display = 'inline-block';
    }

    let base = (this.inverse ? this.rate.inverseAmount : this.rate.amount);
    base /= (1 + this.rate.change / 100);

    this.yScaleMin = Number.MAX_SAFE_INTEGER;
    this.yScaleMax = Number.MIN_SAFE_INTEGER;

    this.items = [
      {
        name: this.name,
        series: this.rate.history.map((value, index) => {
          const day = 6 - index;
          value = base * (1 + value / 100);

          if (value > this.yScaleMax) {
            this.yScaleMax = value;
          }
          if (value < this.yScaleMin) {
            this.yScaleMin = value;
          }

          return {
            name: day === 0 ? 'now' : `-${day} d`,
            value: Math.round(value * 100) / 100,
          };
        })
      }
    ];

    this.yScaleMin *= 0.9;
    this.yScaleMax *= 1.1;
  }

}
