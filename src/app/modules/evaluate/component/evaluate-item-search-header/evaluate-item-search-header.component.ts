import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-evaluate-item-search-header',
  templateUrl: './evaluate-item-search-header.component.html',
  styleUrls: ['./evaluate-item-search-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemSearchHeaderComponent {
  @Input()
  public count: number;

  @Input()
  public total: number;

  @Input()
  public graph: boolean;

  @Output()
  public graphChange = new EventEmitter<boolean>();

  public onClick(value: boolean): void {
    if (this.graph !== value) {
      this.graph = value;
      this.graphChange.next(this.graph);
    }
  }
}
