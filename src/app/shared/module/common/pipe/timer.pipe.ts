import { Pipe, PipeTransform } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'timer',
})
export class TimerPipe implements PipeTransform {
    public transform(start: Date): Observable<string> {
        return timer(0, 1000).pipe(
            map(() => {
                const diff = new Date(Date.now() - start.getTime());
                const minutes = diff.getMinutes();
                const m = '0' + minutes;
                const seconds = diff.getSeconds();
                const s = '0' + seconds;
                return `${m.substr(m.length - 2)}:${s.substr(s.length - 2)}`;
            })
        );
    }
}
