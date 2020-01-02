import { Injectable } from '@angular/core';
import { Language } from '@shared/module/poe/type';
import { Item } from '@shared/module/poe/type/item.type';
import { Observable, of, throwError } from 'rxjs';
import { BaseItemTypeService } from '../../base-item-type/base-item-type.service';
import { WordService } from '../../word/word.service';

@Injectable({
    providedIn: 'root'
})
export class ItemTranslatorService {

    constructor(
        private readonly wordService: WordService,
        private readonly baseItemTypeService: BaseItemTypeService) { }

    public translate(item: Item, language: Language): Observable<Item> {
        return this.translateNameType(item, language);
    }

    private translateNameType(item: Item, language: Language): Observable<Item> {
        const nameId = this.wordService.search(item.name, item.language);
        const name = nameId ? this.wordService.translate(nameId, language) : '';
        const typeId = this.baseItemTypeService.search(item.type, item.language);
        const type = typeId ? this.baseItemTypeService.translate(typeId, language) : '';

        if (!nameId && !typeId) {
            return throwError(`'${item.nameType}:${Language[item.language]}' does not exists in language: '${Language[language]}'.`);
        }

        return of({
            ...item,
            name,
            type,
            nameType: (`${name || ''} ${type || ''}`).trim(),
            language
        });
    }
}
