import AutoLaunch from 'auto-launch';
import { IpcMain } from 'electron';

export function register(ipcMain: IpcMain): void {
    const launch = new AutoLaunch({
        name: 'PoE Overlay'
    });

    ipcMain.on('app-auto-launch-enabled', event => {
        launch.isEnabled()
            .then((enabled: boolean) => event.sender.send('app-auto-launch-enabled-result', enabled))
            .catch(() => event.sender.send('app-auto-launch-enabled-result', false));
    });

    ipcMain.on('app-auto-launch-change', (event, enabled) => {
        (enabled ? launch.enable() : launch.disable())
            .then(() => event.sender.send('app-auto-launch-change-result', true))
            .catch(() => event.sender.send('app-auto-launch-change-result', false));
    });
}