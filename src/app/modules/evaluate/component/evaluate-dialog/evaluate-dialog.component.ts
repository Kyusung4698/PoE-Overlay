import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { SnackBarService } from '@shared/module/material/service';
import { ItemSearchEvaluateService, ItemSearchService } from '@shared/module/poe/service';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Item, ItemRarity, ItemSearchEvaluateResult, Language } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { debounceTime, flatMap, switchMap, takeUntil } from 'rxjs/operators';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

export interface EvaluateDialogData {
  item: Item;
  settings: EvaluateUserSettings;
  language?: Language;
}

@Component({
  selector: 'app-evaluate-dialog',
  templateUrl: './evaluate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateDialogComponent implements OnInit, AfterViewInit {
  private queryItemChange: Subject<Item>;
  public queryItem: Item;

  public result$ = new BehaviorSubject<ItemSearchEvaluateResult>(null);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EvaluateDialogData,
    private readonly itemSearchService: ItemSearchService,
    private readonly itemSearchEvaluateService: ItemSearchEvaluateService,
    private readonly currencyService: CurrencyService,
    private readonly window: WindowService,
    private readonly snackbar: SnackBarService) {
  }

  public ngOnInit(): void {
    this.initQueryItem();
  }

  public ngAfterViewInit(): void {
    this.firstSearch();
    this.registerSearchOnChange();
  }

  public onQueryItemChange(queryItem: Item): void {
    this.queryItemChange.next(queryItem);
  }

  public onCurrencyClick(event: MouseEvent): void {
    const result = this.result$.getValue();
    if (result && result.url) {
      this.window.open(result.url, event.ctrlKey);
    }
  }

  private initQueryItem(): void {
    const item = this.data.item;
    const queryItem: Item = {
      nameId: item.nameId,
      typeId: item.typeId,
      category: item.category,
      rarity: item.rarity,
      corrupted: item.corrupted,
      veiled: item.veiled,
      influences: item.influences || {},
      damage: {},
      stats: [],
      properties: {},
      requirements: {},
      sockets: new Array((item.sockets || []).length).fill({}),
    };

    if (this.data.settings.evaluateQueryDefaultItemLevel) {
      queryItem.level = item.level;
    }

    if (this.data.settings.evaluateQueryDefaultSockets) {
      queryItem.sockets = item.sockets;
    }

    if (this.data.settings.evaluateQueryDefaultMiscs) {
      const prop = item.properties;
      if (prop) {
        queryItem.properties.gemLevel = prop.gemLevel;
        queryItem.properties.mapTier = prop.mapTier;
        queryItem.properties.quality = item.rarity === ItemRarity.Gem ? prop.quality : undefined;
      }
    }

    if (!this.data.settings.evaluateQueryDefaultType) {
      if (!item.nameId && (item.rarity === ItemRarity.Magic || ItemRarity.Rare)) {
        queryItem.typeId = undefined;
      }
    }

    if (item.stats) {
      queryItem.stats = item.stats.map(stat => {
        const key = `${stat.type}.${stat.tradeId}`;
        return this.data.settings.evaluateQueryDefaultStats[key] ? stat : undefined;
      });
    }

    this.queryItem = JSON.parse(JSON.stringify(queryItem));
    this.queryItemChange = new Subject<Item>();
  }

  private firstSearch(): void {
    this.search(this.queryItem).pipe(
      takeUntil(this.queryItemChange)
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
  }

  private registerSearchOnChange(): void {
    this.queryItemChange.pipe(
      debounceTime(500),
      switchMap(queryItem => {
        this.result$.next(null);
        return this.search(queryItem).pipe(
          takeUntil(this.queryItemChange)
        );
      })
    ).subscribe(result => this.result$.next(result), error => this.handleError(error));
  }

  private search(item: Item): Observable<ItemSearchEvaluateResult> {
    const currencies$ = this.data.settings.evaluateCurrencyIds.map(id => this.currencyService.searchById(id));
    return forkJoin(
      this.itemSearchService.search(item, {
        indexed: this.data.settings.evaluateQueryIndexed,
        online: this.data.settings.evaluateQueryOnline,
      }),
      forkJoin(currencies$)
    ).pipe(
      flatMap(results => {
        if (results[0].items.length <= 0) {
          const empty: ItemSearchEvaluateResult = {
            url: results[0].url,
            items: [],
            total: 0,
          };
          return of(empty);
        }
        return this.itemSearchEvaluateService.evaluate(results[0], results[1]);
      })
    );
  }

  private handleError(error: any): void {
    this.result$.next({
      url: null,
      items: null,
      total: null
    });
    this.snackbar.error(`${typeof error === 'string' ? `${error}` : 'An unexpected error occured while searching for the item.'}`);
  }
}
