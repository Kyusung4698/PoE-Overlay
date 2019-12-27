import { Injectable } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { Point } from '@app/type';
import { Remote } from 'electron';

@Injectable({
    providedIn: 'root'
})
export class MouseService {
    private readonly electron: Remote;

    constructor(
        electronProvider: ElectronProvider) {
        this.electron = electronProvider.provideRemote();
    }

    public getCursorScreenPoint(): Point {
        return this.electron.screen.getCursorScreenPoint();
    }
}
