import { Pipe, PipeTransform } from '@angular/core';
import { ItemStat } from '../item';

@Pipe({
    name: 'statGroup'
})
export class StatGroupPipe implements PipeTransform {
    public transform(stats: ItemStat[]): any {
        const groups = {};
        stats.forEach((stat, index) => (groups[stat.type] || (groups[stat.type] = [])).push({
            ...stat,
            index
        }));
        return groups;
    }
}
