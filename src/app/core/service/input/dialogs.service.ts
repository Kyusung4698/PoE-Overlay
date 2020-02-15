import { Injectable } from '@angular/core';
import { VisibleFlag } from '@app/type/app.type';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ShortcutService } from './shortcut.service';

export type DialogCloseFn = () => void;

@Injectable({
    providedIn: 'root'
})
export class DialogsService {
    private readonly dialogCloseFns: DialogCloseFn[] = [];
    private readonly dialogCountChange$ = new BehaviorSubject<number>(0);

    private escapeSubscription: Subscription;
    private spaceSubscription: Subscription;

    constructor(private readonly shortcutService: ShortcutService) { }

    public register(): void {
        this.escapeSubscription = this.shortcutService
            .add('escape', false, VisibleFlag.Dialog)
            .subscribe(() => this.close());

        this.spaceSubscription = this.shortcutService
            .add('space', false, VisibleFlag.Game | VisibleFlag.Dialog)
            .subscribe(() => this.closeAll());
    }

    public reset(): void {
        if (this.escapeSubscription) {
            this.escapeSubscription.unsubscribe();
        }
        if (this.spaceSubscription) {
            this.spaceSubscription.unsubscribe();
        }
        this.closeAll();
    }

    public dialogCountChange(): Observable<number> {
        return this.dialogCountChange$;
    }

    public add(close: DialogCloseFn): void {
        this.dialogCloseFns.push(close);
        this.dialogCountChange$.next(this.dialogCloseFns.length);
    }

    public remove(close: DialogCloseFn): void {
        const index = this.dialogCloseFns.indexOf(close);
        if (index !== -1) {
            this.dialogCloseFns.splice(index, 1);
            this.dialogCountChange$.next(this.dialogCloseFns.length);
        }
    }

    private close(): void {
        if (this.dialogCloseFns.length > 0) {
            this.dialogCloseFns.pop()();
            this.dialogCountChange$.next(this.dialogCloseFns.length);
        }
    }

    private closeAll(): void {
        while (this.dialogCloseFns.length > 0) {
            this.close();
        }
    }
}