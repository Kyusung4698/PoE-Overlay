import { Pipe, PipeTransform } from '@angular/core';
import { WordService } from '../service';
import { Language } from '../type';

@Pipe({
    name: 'word'
})
export class WordPipe implements PipeTransform {
    constructor(private readonly wordService: WordService) {
    }

    public transform(value: string, language: Language) {
        return this.wordService.translate(value, language);
    }
}
