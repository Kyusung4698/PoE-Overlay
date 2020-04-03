import { IpcMain, Menu, MenuItem, Tray } from "electron";
import { autoUpdater } from 'electron-updater';

let downloadItem: MenuItem = null;
let checkForUpdatesHandle = null;

export enum AutoUpdaterEvent {
    UpdateAvailable = 'app-update-available',
    UpdateDownloaded = 'app-update-downloaded'
}

export function register(ipcMain: IpcMain, menu: Menu, tray: Tray, onEvent: (event: AutoUpdaterEvent) => void): void {
    autoUpdater.on('update-available', () => {
        onEvent(AutoUpdaterEvent.UpdateAvailable);
        tray?.displayBalloon({
            iconType: 'info',
            title: 'New update available',
            content: 'A new update is available. Will be automatically downloaded unless otherwise specified.',
        });
        if (!autoUpdater.autoDownload && !downloadItem) {
            downloadItem = new MenuItem({
                label: 'Download Update',
                type: 'normal',
                click: () => {
                    autoUpdater.downloadUpdate();
                    downloadItem.enabled = false;
                }
            });
            menu?.insert(2, downloadItem);
        }
        if (checkForUpdatesHandle) {
            clearInterval(checkForUpdatesHandle);
            checkForUpdatesHandle = null;
        }
    });

    autoUpdater.on('update-downloaded', () => {
        onEvent(AutoUpdaterEvent.UpdateDownloaded);
        tray?.displayBalloon({
            iconType: 'info',
            title: 'Update ready to install',
            content: 'The new update is now ready to install. Please relaunch your application.',
        });
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