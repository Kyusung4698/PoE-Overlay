import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { TradeFetchAnalyzeResult } from '@shared/module/poe/trade';

interface Row {
  amount: number;
  originalAmount: number;
  originalCurrency: string;
  count: number;
  seller: string;
  age: string;
}

interface RowMap {
  [key: string]: Row;
}

const ROW_KEY = (row: Row) => `${row.amount}_${row.seller}_${row.age}`;

@Component({
  selector: 'app-evaluate-item-search-table',
  templateUrl: './evaluate-item-search-table.component.html',
  styleUrls: ['./evaluate-item-search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemSearchTableComponent {
  public rows: Row[] = [];
  public currency: string;

  @Input()
  public set result(result: TradeFetchAnalyzeResult) {
    this.currency = result.currency;
    if (!result.entries.length) {
      this.rows = [];
      return;
    }
    this.update(result);
  }

  @Input()
  public original: boolean;

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  private update(analyze: TradeFetchAnalyzeResult): void {
    const rows: RowMap = {};
    analyze.entries.forEach(item => {
      const { listing } = item.fetch;
      // TODO:
      const row: Row = {
        amount: Math.round(item.targetAmount * 100) / 100, count: 1,
        originalAmount: listing.price.amount, originalCurrency: listing.price.currency,
        seller: listing.seller, age: listing.age,
      };
      const key = ROW_KEY(row);
      if (rows[key]) {
        rows[key].count++;
      } else {
        rows[key] = row;
      }
    });
    this.rows = Object.getOwnPropertyNames(rows)
      .map(key => rows[key])
      .sort((a, b) => a.amount - b.amount);
  }

  public onRowClick(event: MouseEvent, row: Row): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const selectEvent: EvaluateSelectEvent = {
      amount: this.original ? row.originalAmount : row.amount,
      currency: this.original ? row.originalCurrency : this.currency
    };
    this.evaluateSelect.next(selectEvent);
  }
}
