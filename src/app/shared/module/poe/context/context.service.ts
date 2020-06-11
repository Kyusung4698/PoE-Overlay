import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Context } from './context';
import { ContextFactory } from './context.factory';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private readonly context$ = new BehaviorSubject<Context>(undefined);

    constructor(private readonly contextFactory: ContextFactory) { }

    public init(defaultContext: Context): Observable<Context> {
        return from(this.contextFactory.create(defaultContext).pipe(
            tap(createdContext => this.context$.next(createdContext))
        ).toPromise());
    }

    public get(): Context {
        return { ...this.context$.getValue() };
    }

    public update(context: Context): void {
        this.context$.next(context);
    }
}
