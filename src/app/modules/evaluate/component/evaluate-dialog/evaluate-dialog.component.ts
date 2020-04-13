import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EvaluateQueryItemProvider } from '@modules/evaluate/provider/evaluate-query-item.provider';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { StashPriceTagType } from '@shared/module/poe/service';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Item, ItemCategory, ItemRarity, Language } from '@shared/module/poe/type';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { buffer, debounceTime, shareReplay } from 'rxjs/operators';
import { EvaluateOptions } from '../evaluate-options/evaluate-options.component';
import { EvaluateUserSettings } from '../evaluate-settings/evaluate-settings.component';

const CURRENCIES_CACHE_SIZE = 1;

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
export class EvaluateDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private resultChange = new Subject<EvaluateResult>();

  public options: EvaluateOptions;
  public optionsChange = new Subject<EvaluateOptions>();

  public defaultItem: Item;
  public queryItem: Item;
  public queryItemChange = new Subject<Item>();

  public currencies$: Observable<Currency[]>;

  public init$ = new BehaviorSubject<boolean>(false);
  public rate$ = new BehaviorSubject<boolean>(true);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: EvaluateDialogData,
    private readonly ref: MatDialogRef<EvaluateDialogComponent>,
    private readonly evaluateQueryItemProvider: EvaluateQueryItemProvider,
    private readonly currencyService: CurrencyService) {
  }

  public ngOnInit(): void {
    this.options = {
      indexed: this.data.settings.evaluateQueryIndexedRange,
      online: this.data.settings.evaluateQueryOnline,
      leagueId: this.data.settings.leagueId
    };
    const { defaultItem, queryItem } = this.evaluateQueryItemProvider.provide(this.data.item, this.data.settings);
    this.defaultItem = defaultItem;
    this.queryItem = queryItem;
    this.currencies$ = this.getCurrencies();
    this.registerResultChange();
    this.checkRate();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.init$.next(true);
    }, 1);
  }

  public ngOnDestroy(): void {
    this.queryItemChange.complete();
    this.optionsChange.complete();
    this.resultChange.complete();
  }

  public onQueryItemChange(queryItem: Item): void {
    this.queryItem = queryItem;
    this.queryItemChange.next(queryItem);
  }

  public onOptionsChange(options: EvaluateOptions): void {
    this.options = options;
    this.optionsChange.next(this.options);
    this.onQueryItemChange(this.queryItem);
  }

  public onReset(): void {
    const queryItem = JSON.parse(JSON.stringify(this.defaultItem));
    this.onQueryItemChange(queryItem);
  }

  public onEvaluateResult(result: EvaluateResult): void {
    this.resultChange.next(result);
  }

  private registerResultChange(): void {
    this.resultChange.pipe(
      buffer(this.resultChange.pipe(
        debounceTime(250)
      ))
    ).subscribe(([result, double]) => {
      const type = double ? StashPriceTagType.Negotiable : StashPriceTagType.Exact;
      this.ref.close({ ...result, type });
    });
  }

  private getCurrencies(): Observable<Currency[]> {
    const currencies$ = this.data.settings.evaluateCurrencyIds.map(id => this.currencyService.searchById(id));
    return forkJoin(currencies$).pipe(
      shareReplay(CURRENCIES_CACHE_SIZE)
    );
  }

  private checkRate(): void {
    if (this.data.item.rarity === ItemRarity.Rare) {
      switch (this.data.item.category) {
        case ItemCategory.Jewel:
        case ItemCategory.JewelAbyss:
        case ItemCategory.Flask:
        case ItemCategory.Weapon:
        case ItemCategory.WeaponOne:
        case ItemCategory.WeaponOneMelee:
        case ItemCategory.WeaponTwoMelee:
        case ItemCategory.WeaponBow:
        case ItemCategory.WeaponClaw:
        case ItemCategory.WeaponDagger:
        case ItemCategory.WeaponRunedagger:
        case ItemCategory.WeaponOneAxe:
        case ItemCategory.WeaponOneMace:
        case ItemCategory.WeaponOneSword:
        case ItemCategory.WeaponSceptre:
        case ItemCategory.WeaponStaff:
        case ItemCategory.WeaponWarstaff:
        case ItemCategory.WeaponTwoAxe:
        case ItemCategory.WeaponTwoMace:
        case ItemCategory.WeaponTwoSword:
        case ItemCategory.WeaponWand:
        case ItemCategory.WeaponRod:
        case ItemCategory.Armour:
        case ItemCategory.ArmourChest:
        case ItemCategory.ArmourBoots:
        case ItemCategory.ArmourGloves:
        case ItemCategory.ArmourHelmet:
        case ItemCategory.ArmourShield:
        case ItemCategory.ArmourQuiver:
        case ItemCategory.Accessory:
        case ItemCategory.AccessoryAmulet:
        case ItemCategory.AccessoryBelt:
        case ItemCategory.AccessoryRing:
        case ItemCategory.Gem:
        case ItemCategory.GemActivegem:
        case ItemCategory.GemSupportGem:
        case ItemCategory.GemSupportGemplus:
        case ItemCategory.MapScarab:
        case ItemCategory.Leaguestone:
        case ItemCategory.MonsterSample:
        case ItemCategory.CurrencyPiece:
          this.rate$.next(false);
          break;
      }
    }
  }
}
