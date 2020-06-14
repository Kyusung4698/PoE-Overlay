import { Injectable } from '@angular/core';
import { ItemSocket } from './item';

@Injectable({
    providedIn: 'root'
})
export class ItemSocketsService {
    public getLinkCount(sockets: ItemSocket[]): number {
        let count = 0;
        let maxCount = 0;
        (sockets || []).forEach(x => {
            if (x.linked) {
                ++count;
            }
            if (count > maxCount) {
                maxCount = count;
            }
            if (!x.linked) {
                count = 0;
            }
        });
        if (maxCount > 0) {
            ++maxCount;
        }
        return maxCount;
    }
}
