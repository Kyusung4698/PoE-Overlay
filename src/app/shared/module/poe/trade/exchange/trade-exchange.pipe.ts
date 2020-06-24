import { Pipe, PipeTransform } from '@angular/core';
import { TradeExchangeRequest } from './trade-exchange';

@Pipe({
    name: 'tradeExchangeText'
})
export class TradeExchangeTextPipe implements PipeTransform {
    public transform(request: TradeExchangeRequest): string {
        const { have, want, minimum } = request.exchange;
        return `${have.join(', ')} <> ${want.join(', ')} (min: ${minimum ? minimum : 'any'})`;
    }
}
