import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { TradeFetchAnalyzeResult, TradeFetchAnalyzeEntryGrouped } from '@shared/module/poe/trade';

@Component({
  selector: 'app-evaluate-item-search-graph',
  templateUrl: './evaluate-item-search-graph.component.html',
  styleUrls: ['./evaluate-item-search-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemSearchGraphComponent {
  private currency: string;

  public items: any[];
  public total: number;
  public view = [376 + 20, 200];
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
  public groups: {
    [value: number]: TradeFetchAnalyzeEntryGrouped
  } = {};
  public xAxisTickFormatting = this.format.bind(this);

  @HostBinding('style.width')
  public width = `${this.view[0]}px`;

  @HostBinding('style.height')
  public height = `${this.view[1]}px`;

  @HostBinding('style.display')
  public display = 'block';

  @Input()
  public set result(result: TradeFetchAnalyzeResult) {
    this.update(result);
  }

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  public onSelect(event: { name: number }): void {
    const selectEvent: EvaluateSelectEvent = {
      amount: event.name,
      currency: this.currency
    };
    this.evaluateSelect.emit(selectEvent);
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

  private update(result: TradeFetchAnalyzeResult): void {
    if (!result.entryGroups) {
      this.display = 'none';
      this.items = [];
    } else {
      this.display = 'block';
      this.groups = {};
      this.currency = result.currency;
      this.items = result.entryGroups.map(x => {
        this.groups[x.value] = x;
        return { name: x.value, value: x.items.length };
      });
    }
  }
}
