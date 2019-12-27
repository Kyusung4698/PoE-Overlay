import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyService } from '@shared/module/poe/service/currency/currency-service';
import { ItemSearchEvaluateService } from '@shared/module/poe/service/item/item-search-evaluate.service';
import { ItemSearchService } from '@shared/module/poe/service/item/item-search.service';
import { Item, ItemSearchEvaluateResult } from '@shared/module/poe/type';
import { forkJoin, Observable, of, BehaviorSubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  styleUrls: ['./evaluate-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit {
  public result$ = new BehaviorSubject<ItemSearchEvaluateResult>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public item: Item,
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchEvaluateService,
    private readonly currencyService: CurrencyService,
  ) {

  }

  public ngOnInit(): void {
    forkJoin(
      this.itemSearchService.search(this.item),
      this.currencyService.getForId('chaos')
    ).pipe(
      flatMap(results => {
        if (!results[0]) {
          const empty: ItemSearchEvaluateResult = {
            items: [],
            targetCurrency: null,
            targetCurrencyAvg: null
          };
          return of(empty);
        }
        return this.itemSearchEvaluateService.evaluate(results[0], results[1]);
      })
    ).subscribe(result => {
      this.result$.next(result);
    });
  }
}
