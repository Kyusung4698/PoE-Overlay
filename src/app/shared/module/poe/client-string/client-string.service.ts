import { Injectable } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '../context';
import { ClientStringProvider } from './client-string.provider';

@Injectable({
    providedIn: 'root'
})
export class ClientStringService {
    constructor(
        private readonly context: ContextService,
        private readonly clientString: ClientStringProvider) { }

    public translate(id: string, language?: Language): string {
        language = language || this.context.get().language;

        const strings = this.clientString.provide(language);

        const result = strings[id];
        if (!result) {
            console.warn(`untranslated: '${id}' for language: '${Language[language]}'`);
            return `untranslated: '${id}' for language: '${Language[language]}'`;
        }
        return result;
    }
}
