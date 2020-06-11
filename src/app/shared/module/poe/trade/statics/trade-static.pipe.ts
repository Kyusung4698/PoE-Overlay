import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TradeStatic } from './trade-statics';
import { TradeStaticsService } from './trade-statics.service';

@Pipe({
    name: 'tradeStatic'
})
export class TradeStaticPipe implements PipeTransform {
    constructor(private readonly statics: TradeStaticsService) {
    }

    public transform(id: string): Observable<TradeStatic> {
        return this.statics.match(id);
    }
}
