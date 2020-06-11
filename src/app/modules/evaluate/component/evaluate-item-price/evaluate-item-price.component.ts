import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluateSelectEvent } from '@modules/evaluate/class';
import { Item, ItemRarity } from '@shared/module/poe/item';
import { ItemCategory } from '@shared/module/poe/item/base-item-type';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EvaluateItemOptions } from '../evaluate-item-options/evaluate-item-options.component';

@Component({
  selector: 'app-evaluate-item-price',
  templateUrl: './evaluate-item-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemPriceComponent implements OnInit {
  public prediction$: Observable<boolean>;

  @Input()
  public item: Item;

  @Input()
  public currencies: string[];

  @Input()
  public options: EvaluateItemOptions;

  @Input()
  public optionsChange: Subject<EvaluateItemOptions>;

  @Output()
  public evaluateSelect = new EventEmitter<EvaluateSelectEvent>();

  public ngOnInit(): void {
    this.prediction$ = of(this.item).pipe(
      map(item => {
        if (item.rarity !== ItemRarity.Rare) {
          return false;
        }

        switch (item.category) {
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
            return true;
        }

        return false;
      })
    );
  }

}
