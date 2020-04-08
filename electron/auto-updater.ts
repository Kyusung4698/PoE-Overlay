import { IpcMain } from "electron";
import { autoUpdater } from 'electron-updater';

let checkForUpdatesHandle = null;

export enum AutoUpdaterEvent {
    UpdateAvailable = 'app-update-available',
    UpdateDownloaded = 'app-update-downloaded'
}

export function download(): void {
    autoUpdater.downloadUpdate();
}

export function register(ipcMain: IpcMain, onEvent: (event: AutoUpdaterEvent, autoDownload: boolean) => void): void {
    autoUpdater.on('update-available', () => {
        onEvent(AutoUpdaterEvent.UpdateAvailable, autoUpdater.autoDownload);
        if (checkForUpdatesHandle) {
            clearInterval(checkForUpdatesHandle);
            checkForUpdatesHandle = null;
        }
    });

    autoUpdater.on('update-downloaded', () => {
        onEvent(AutoUpdaterEvent.UpdateDownloaded, autoUpdater.autoDownload);
    });

    ipcMain.on('app-download-init', (event, autoDownload) => {
        autoUpdater.autoDownload = autoDownload;
        autoUpdater.checkForUpdates();
        checkForUpdatesHandle = setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 1000 * 60 * 5);
        event.returnValue = true;
    });

    ipcMain.on('app-download-auto', (event, autoDownload) => {
        autoUpdater.autoDownload = autoDownload;
        event.returnValue = true;
    });

    ipcMain.on('app-download-update', event => {
        autoUpdater.downloadUpdate();
        event.returnValue = true;
    });

    ipcMain.on('app-quit-and-install', (event, restart) => {
        autoUpdater.quitAndInstall(false, restart);
        event.returnValue = true;
    });

    autoUpdater.logger = console;
    autoUpdater.autoInstallOnAppQuit = true;
}