import { Injectable } from '@angular/core';
import { OWUtils } from '@app/odk/ow-utils';

@Injectable({
    providedIn: 'root'
})
export class BookmarkService {
    public open(url: string, external: boolean): void {
        OWUtils.openUrl(url, external);
    }
}
