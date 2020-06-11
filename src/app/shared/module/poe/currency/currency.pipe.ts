import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from './currency';
import { CurrencyService } from './currency.service';

@Pipe({
    name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
    constructor(private readonly currencyService: CurrencyService) { }

    public transform(currency: string): Observable<Currency> {
        return this.currencyService.searchById(currency);
    }
}
