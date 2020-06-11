import { Pipe, PipeTransform } from '@angular/core';
import { TradeStat } from './trade-stats';

@Pipe({
    name: 'tradeStatsType'
})
export class TradeStatsTypePipe implements PipeTransform {
    public transform(stat: TradeStat): string {
        const [type] = stat.id.split('.');
        return type;
    }
}
