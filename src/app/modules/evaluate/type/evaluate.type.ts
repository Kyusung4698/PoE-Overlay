import { PriceTagType } from '@shared/module/poe/service';
import { Currency } from '@shared/module/poe/type';

export interface EvaluateResult {
    currency: Currency;
    amount: number;
    type: PriceTagType;
}
