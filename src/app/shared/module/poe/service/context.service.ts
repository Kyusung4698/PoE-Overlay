import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContextFactory } from '../factory';
import { Context } from '../type';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private readonly contextSubject = new BehaviorSubject<Context>(undefined);

    constructor(private readonly contextFactory: ContextFactory) { }

    public init(defaultContext: Context): Observable<Context> {
        return from(this.contextFactory.create(defaultContext).pipe(
            tap(createdContext => this.contextSubject.next(createdContext))
        ).toPromise());
    }

    public get(): Context {
        // return copy
        return { ...this.contextSubject.getValue() };
    }

    public update(context: Context): void {
        this.contextSubject.next(context);
    }

    public change(): Observable<Context> {
        return this.contextSubject.pipe(
            map(context => {
                // return copy
                return { ...context };
            })
        );
    }
}
