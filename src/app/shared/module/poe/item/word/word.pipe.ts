import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@data/poe/schema';
import { WordService } from './word.service';

@Pipe({
    name: 'word'
})
export class WordPipe implements PipeTransform {
    constructor(private readonly wordService: WordService) { }

    public transform(value: string, language: Language): string {
        return this.wordService.translate(value, language);
    }
}
