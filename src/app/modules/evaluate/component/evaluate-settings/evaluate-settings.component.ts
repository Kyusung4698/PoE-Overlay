import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EnumValues } from '@app/class';
import { CurrencyService } from '@shared/module/poe/service/currency/currency.service';
import { Currency, Language } from '@shared/module/poe/type';
import { BehaviorSubject } from 'rxjs';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface EvaluateUserSettings extends UserSettings {
  currencyId: string;
  translatedItemLanguage: Language;
}

@Component({
  selector: 'app-evaluate-settings',
  templateUrl: './evaluate-settings.component.html',
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

  private updateCurrencies(): void {
    this.currencyService.get(this.settings.language).subscribe(currencies => {
      const selectedCurrency = currencies.find(currency => currency.id === this.settings.currencyId);
      if (!selectedCurrency) {
        this.settings.currencyId = currencies[0].id;
      }
      this.currencies$.next(currencies);
    });
  }

}
