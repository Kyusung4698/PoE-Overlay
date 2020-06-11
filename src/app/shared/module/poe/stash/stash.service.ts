import { Injectable } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';
import { StashPriceTag } from './stash-price-tag';

@Injectable({
    providedIn: 'root'
})
export class StashService {
    public copyPrice(tag: StashPriceTag): void {
        const content = `${tag.type} ${(tag.count ? `${tag.amount}/${tag.count}` : tag.amount)} ${tag.currency}`;
        OWUtils.placeOnClipboard(content);
    }
}
