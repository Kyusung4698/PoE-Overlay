import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TradeStatic } from './trade-statics';
import { TradeStaticsService } from './trade-statics.service';

@Pipe({
    name: 'tradeStatic'
})
export class TradeStaticPipe implements PipeTransform {
    constructor(private readonly statics: TradeStaticsService) {
    }

    public transform(id: string): Observable<TradeStatic> {
        return this.statics.match(id).pipe(
            mergeMap(matched => {
                if (matched) {
                    return of(matched);
                }
                return this.statics.find(id).pipe(
                    map(found => {
                        if (found) {
                            return found;
                        }
                        return { id, name: id };
                    })
                );
            })
        );
    }
}
