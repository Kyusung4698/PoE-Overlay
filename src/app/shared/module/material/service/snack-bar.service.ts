import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    constructor(
        private readonly matSnackBar: MatSnackBar,
        private readonly translate: TranslateService) {
    }

    public error(message: string, action?: string): Observable<void> {
        return this.show(message, 'error', action);
    }

    public info(message: string, action?: string): Observable<void> {
        return this.show(message, 'info', action);
    }

    public warning(message: string, action?: string): Observable<void> {
        return this.show(message, 'warning', action);
    }

    public success(message: string, action?: string): Observable<void> {
        return this.show(message, 'success', action);
    }

    private show(message: string, panelClass: string, action?: string): Observable<void> {
        return from(
            forkJoin([
                this.translate.get(message),
                action ? this.translate.get(action) : of(undefined)
            ]).pipe(
                flatMap(([translatedMessage, translatedAction]) => this.matSnackBar.open(translatedMessage, translatedAction, {
                    duration: 5 * 1000,
                    verticalPosition: 'bottom',
                    panelClass: ['snack-bar-service', panelClass]
                }).onAction())
            ).toPromise());
    }
}
