import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemSearchAnalyzeResult } from '@shared/module/poe/service';
import { Currency } from '@shared/module/poe/type';

interface Row {
  amount: number;
  count: number;
  seller: string;
  age: string;
}

@Component({
  selector: 'app-evaluate-search-table',
  templateUrl: './evaluate-search-table.component.html',
  styleUrls: ['./evaluate-search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSearchTableComponent {
  public rows: Row[] = [];
  public currency: Currency;

  @Input()
  public set result(result: ItemSearchAnalyzeResult) {
    this.currency = result.currency;
    if (result.items.length > 0) {
      const keyFn = (row: Row): string => {
        return `${row.amount}_${row.seller}_${row.age}`;
      };
      const map: {
        [key: string]: Row
      } = {};
      result.items.forEach(item => {
        const next: Row = {
          amount: Math.round(item.targetAmount * 100) / 100, count: 1,
          seller: item.seller, age: item.age,
        };
        const key = keyFn(next);
        if (map[key]) {
          map[key].count++;
        } else {
          map[key] = next;
        }
      });
      this.rows = Object.getOwnPropertyNames(map).map(key => map[key]).sort((a, b) => a.amount - b.amount);
    } else {
      this.rows = [];
    }
  }

  @Output()
  public amountSelect = new EventEmitter<number>();

  public onRowClick(amount: number): void {
    this.amountSelect.next(amount);
  }
}
