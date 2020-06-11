import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '../../context';
import { WordsProvider } from './words.provider';

@Injectable({
    providedIn: 'root'
})
export class WordService {
    constructor(
        private readonly context: ContextService,
        private readonly wordProvider: WordsProvider) { }

    public translate(id: string, language?: Language): string {
        language = language || this.context.get().language;

        const words = this.wordProvider.provide(language);
        if (!words[id]) {
            console.warn(`untranslated: '${id}' for language: '${Language[language]}'`);
            return `untranslated: '${id}' for language: '${Language[language]}'`;
        }
        return words[id];
    }

    public search(text: string, language?: Language): string {
        language = language || this.context.get().language;

        const words = this.wordProvider.provide(language);
        return words[text];
    }
}
