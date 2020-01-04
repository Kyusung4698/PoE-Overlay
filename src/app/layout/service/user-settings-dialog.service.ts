import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { Observable, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { UserSettings } from '../type';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsDialogComponent } from '../component/user-settings-dialog/user-settings-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsDialogService {
    constructor(
        private readonly window: WindowService,
        private readonly dialog: MatDialog,
        private readonly storage: UserSettingsService) { }

    public open(): Observable<UserSettings> {
        return this.storage.get().pipe(
            flatMap(settings => {
                this.window.enableInput();
                return this.dialog.open(UserSettingsDialogComponent, {
                    disableClose: true,
                    backdropClass: 'backdrop-fullsize',
                    data: settings
                }).afterClosed().pipe(
                    tap(() => {
                        if (this.dialog.openDialogs.length === 0) {
                            this.window.disableInput();
                        }
                    }),
                    flatMap(result => {
                        if (result) {
                            return this.storage.save(result);
                        }
                        return of(null);
                    })
                );
            })
        );
    }
}
