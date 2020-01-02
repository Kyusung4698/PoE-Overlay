import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchEvaluateService, ItemSearchService } from '@shared/module/poe/service';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Item, ItemSearchEvaluateResult } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit {
  private url: string;
  public result$ = new BehaviorSubject<ItemSearchEvaluateResult>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public item: Item,
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchEvaluateService,
    private readonly currencyService: CurrencyService,
    private readonly window: WindowService,
    private readonly snackbar: SnackBarService) { }

  public ngOnInit(): void {
    forkJoin(
      this.itemSearchService.search(this.item),
      this.currencyService.get('chaos')
    ).pipe(
      flatMap(results => {
        this.url = results[0].url;

        if (results[0].items.length <= 0) {
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
    }, (error) => {
      this.result$.next({
        items: null
      });
      this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'An unexpected error occured while searching for the item.'}`);
    });
  }

  public onCurrencyClick(): void {
    if (this.url) {
      this.window.open(this.url);
    }
  }
}
