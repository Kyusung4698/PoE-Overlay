import { IpcMain } from 'electron';

interface MouseWheelEvent {
    rotation: number;
    ctrlKey: boolean;
}

type MouseWheelFn = (event: MouseWheelEvent) => void;

class Hook {
    private active = false;
    private callback: MouseWheelFn = undefined;

    public enable(callback: MouseWheelFn): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (this.active) {
                resolve(false);
            } else {
                try {
                    const iohook = (await import('iohook')).default;
                    iohook.start();
                    iohook.on('mousewheel', callback);

                    this.active = true;
                    this.callback = callback;

                    resolve(true);
                }
                catch (error) {
                    console.error('An unexpected error occured while registering iohook', error);
                    reject(error);
                }
            }
        });
    }

    public disable(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.active) {
                resolve(false);
            } else {
                try {
                    const iohook = (await import('iohook')).default;
                    iohook.off('mousewheel', this.callback);
                    iohook.stop();

                    this.active = false;
                    this.callback = undefined;

                    resolve(true);
                }
                catch (error) {
                    console.error('An unexpected error occured while unregistering iohook', error);
                    reject(error);
                }
            }
        });
    }
}

const hook = new Hook();

export function register(ipcMain: IpcMain, onEvent: (channel: string) => void, onError: (error: any) => void): void {

    ipcMain.on('register-shortcut', (event, accelerator) => {
        switch (accelerator) {
            case 'CmdOrCtrl + MouseWheelUp':
            case 'CmdOrCtrl + MouseWheelDown':
                hook.enable(e => {
                    if (e.ctrlKey) {
                        const channel = `shortcut-CmdOrCtrl + ${e.rotation === -1 ? 'MouseWheelUp' : 'MouseWheelDown'}`;
                        onEvent(channel);
                    }
                }).then(
                    success => success ? console.debug('Started listening for Mousewheel-Events.') : null,
                    error => onError(error)
                );
                break;
            default:
                break;
        }
        event.returnValue = true;
    });

    ipcMain.on('unregister-shortcut', (event, accelerator) => {
        switch (accelerator) {
            case 'CmdOrCtrl + MouseWheelUp':
            case 'CmdOrCtrl + MouseWheelDown':
                hook.disable().then(
                    success => success ? console.debug('Stopped listening for Mousewheel-Events.') : null,
                    error => onError(error)
                );
                break;
            default:
                break;
        }
        event.returnValue = true;
    });
}

export function unregister(): void {
    hook.disable();
}