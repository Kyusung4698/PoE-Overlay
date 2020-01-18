import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EnumValues } from '@app/class';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Language } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';

export interface EvaluateUserSettings extends UserSettings {
  evaluateCurrencyIds: string[];
  evaluateKeybinding: string;
  evaluateTranslatedItemLanguage: Language;
  evaluateTranslatedKeybinding: string;
  evaluateQueryDefault: boolean;
  evaluateQueryOnline: boolean;
  evaluateQueryIndexed: ItemSearchIndexed;
  evaluateModifierRange: number;
  evaluateModifierDisableMaxRange: boolean;
}

@Component({
  selector: 'app-evaluate-settings',
  templateUrl: './evaluate-settings.component.html',
  styleUrls: ['./evaluate-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateSettingsComponent implements UserSettingsComponent {
  public languages = new EnumValues(Language);
  public settings: EvaluateUserSettings;

  public currencies$ = new BehaviorSubject<Currency[]>([]);

  constructor(private readonly currencyService: CurrencyService) { }

  public load(): void {
    if (this.settings.language) {
      this.updateCurrencies();
    }
  }

  public onCurrenciesValueChange(): void {
    if (this.settings.evaluateCurrencyIds.length <= 0) {
      this.settings.evaluateCurrencyIds = ['chaos', 'exa'];
    }
  }

  private updateCurrencies(): void {
    this.currencyService.get(this.settings.language).subscribe(currencies => {
      if (this.settings.evaluateCurrencyIds) {
        this.settings.evaluateCurrencyIds = this.settings.evaluateCurrencyIds.filter(id => currencies.find(currency => currency.id === id));
        if (this.settings.evaluateCurrencyIds.length <= 0) {
          this.settings.evaluateCurrencyIds = [currencies[0].id];
        }
      }
      this.currencies$.next(currencies);
    });
  }

}
