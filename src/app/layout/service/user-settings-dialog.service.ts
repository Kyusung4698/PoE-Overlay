import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserSettingsDialogComponent, UserSettingsDialogData } from '../component/user-settings-dialog/user-settings-dialog.component';
import { UserSettings, UserSettingsFeature } from '../type';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsDialogService {
    constructor(private readonly dialog: MatDialog) { }

    public open(settings: UserSettings, features: UserSettingsFeature[]): Observable<UserSettings> {
        const data: UserSettingsDialogData = {
            settings,
            features
        };
        return this.dialog.open(UserSettingsDialogComponent, {
            disableClose: true,
            backdropClass: 'backdrop-fullsize',
            data
        }).afterClosed();
    }
}
