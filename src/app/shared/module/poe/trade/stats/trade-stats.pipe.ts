import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TradeStat } from './trade-stats';
import { TradeStatsService } from './trade-stats.service';

@Pipe({
    name: 'tradeStats'
})
export class TradeStatsPipe implements PipeTransform {
    constructor(private readonly stats: TradeStatsService) {
    }

    public transform(id: string): Observable<TradeStat> {
        return this.stats.find(id);
    }
}
