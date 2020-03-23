import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaguesProvider } from '../provider';
import { Language, League } from '../type';
import { ContextService } from './context.service';

@Injectable({
    providedIn: 'root'
})
export class LeaguesService {
    constructor(
        private readonly context: ContextService,
        private readonly leaguesProvider: LeaguesProvider) { }

    public get(language?: Language): Observable<League[]> {
        language = language || this.context.get().language;
        return this.leaguesProvider.provide(language);
    }
}