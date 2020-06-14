import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { environment } from '@env/environment';
import { Item, ItemService } from '../item';

@Injectable({
    providedIn: 'root'
})
export class WikiItemService {

    constructor(
        private readonly itemService: ItemService) { }

    public getUrl(item: Item): string {
        const { nameId, typeId } = item;
        const search = this.getIdentifier(nameId, typeId);
        const url = `${environment.wiki.baseUrl}/index.php?search=${encodeURIComponent(search)}`;
        return url;
    }

    private getIdentifier(nameId: string, typeId: string): string {
        const name = this.itemService.getName(nameId, Language.English);
        if (name?.length) {
            return name;
        }
        return this.itemService.getType(typeId, Language.English);
    }
}
