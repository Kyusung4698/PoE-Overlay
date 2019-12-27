import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    constructor(
        private readonly matSnackBar: MatSnackBar) {
    }

    public error(message: string): Observable<void> {
        return this.show(message, 'error');
    }

    public info(message: string): Observable<void> {
        return this.show(message, 'info');
    }

    public warning(message: string): Observable<void> {
        return this.show(message, 'warning');
    }

    public success(message: string): Observable<void> {
        return this.show(message, 'success');
    }

    private show(message: string, panelClass: string): Observable<void> {
        return from(this.matSnackBar.open(message, undefined, {
            duration: 5 * 1000,
            verticalPosition: 'bottom',
            panelClass: `snack-bar-service-${panelClass}`,
        }).onAction().toPromise());
    }
}
