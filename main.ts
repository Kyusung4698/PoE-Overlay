import { app, BrowserWindow, dialog, Display, ipcMain, Menu, MenuItem, MenuItemConstructorOptions, screen, session, systemPreferences, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';
import UserAgent from 'user-agents';
import * as launch from './electron/auto-launch';
import * as update from './electron/auto-updater';
import * as game from './electron/game';
import * as hook from './electron/hook';
import * as log from './electron/log';
import * as robot from './electron/robot';
import { State } from './electron/state';

if (!app.requestSingleInstanceLock()) {
    app.exit();
}

if (process.platform === 'win32' && !systemPreferences.isAeroGlassEnabled()) {
    dialog.showErrorBox(
        'Aero is required to run PoE Overlay',
        'Aero is currently disabled. Please enable Aero and try again.');
    app.exit();
}

app.allowRendererProcessReuse = false;

app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

log.register(ipcMain);

console.info('App starting...');

const state = new State(app.getPath('userData'));
if (!state.hardwareAcceleration) {
    app.disableHardwareAcceleration();
    console.info('App started with disabled hardware acceleration.');
}

const args = process.argv.slice(1);
console.info('App args', args);

const serve = args.some(val => val === '--serve');

let win: BrowserWindow = null;
let tray: Tray = null;
let menu: Menu = null;
let downloadItem: MenuItem = null;

const childs: {
    [key: string]: BrowserWindow
} = {};

/* session */

function setUserAgent() {
    const userAgent = new UserAgent();
    const generatedUserAgent = userAgent.random().toString();
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = generatedUserAgent;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
}

/* helper */

function getDisplay(): Display {
    return screen.getPrimaryDisplay();
}

function send(channel: string, ...args: any[]) {
    try {
        win.webContents.send(channel, ...args);
    }
    catch (error) {
        console.error(`could not send to '${channel}' with args '${JSON.stringify(args)}`);
    }
}

launch.register(ipcMain);

update.register(ipcMain, (event, autoDownload) => {
    switch (event) {
        case update.AutoUpdaterEvent.UpdateAvailable:
            tray?.displayBalloon({
                iconType: 'info',
                title: 'New update available',
                content: 'A new update is available. Will be automatically downloaded unless otherwise specified.',
            });
            if (!autoDownload && !downloadItem) {
                downloadItem = new MenuItem({
                    label: 'Download Update',
                    type: 'normal',
                    click: () => {
                        update.download();
                        downloadItem.enabled = false;
                    }
                });
                menu?.insert(2, downloadItem);
            }
            break;
        case update.AutoUpdaterEvent.UpdateDownloaded:
            tray?.displayBalloon({
                iconType: 'info',
                title: 'Update ready to install',
                content: 'The new update is now ready to install. Please relaunch your application.',
            });
            break;
    }
    send(event);
});

robot.register(ipcMain);

game.register(ipcMain, poe => {
    // send('game-active-change', serve ? true : poe.active);
    send('game-active-change', poe.active);

    if (win) {
        if (poe.active) {
            win.setAlwaysOnTop(true, 'pop-up-menu', 1);
            win.setVisibleOnAllWorkspaces(true);

            if (poe.bounds) {
                win.setBounds(poe.bounds);
            }
        } else {
            win.setAlwaysOnTop(false);
            win.setVisibleOnAllWorkspaces(false);
        }
    }
});

hook.register(ipcMain, event => send(event), () => {
    dialog.showErrorBox(
        'Iohook is required to run PoE Overlay',
        'Iohook could not be loaded. Please make sure you have vc_redist installed and try again.');
    app.quit();
});

/* general */

ipcMain.on('app-version', event => {
    const version = app.getVersion();
    event.returnValue = version;
});

/* changelog */

function showChangelog() {
    const changelog = new BrowserWindow({
        modal: true,
        parent: win,
    });
    changelog.removeMenu();
    changelog.loadURL('https://github.com/Kyusung4698/PoE-Overlay/blob/master/CHANGELOG.md#Changelog');
}

/* main window */
function createWindow(): BrowserWindow {
    const { bounds } = getDisplay();

    // Create the browser window.
    win = new BrowserWindow({
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        transparent: true,
        frame: false,
        resizable: false,
        movable: false,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve,
            webSecurity: false
        },
        focusable: false,
        skipTaskbar: true,
        show: false,
    });
    win.removeMenu();
    win.setIgnoreMouseEvents(true);

    win.setAlwaysOnTop(true, 'pop-up-menu', 1);
    win.setVisibleOnAllWorkspaces(true);

    win.once('show', () => {
        if (state.isVersionUpdated(app.getVersion())) {
            showChangelog();
        }
    })

    loadApp(win);

    win.on('closed', () => {
        win = null;
    });
    return win;
}

/* modal window */

ipcMain.on('open-route', (event, route) => {
    try {
        if (!childs[route]) {
            childs[route] = new BrowserWindow({
                width: 1210,
                height: 700,
                frame: false,
                closable: false,
                resizable: true,
                movable: true,
                webPreferences: {
                    nodeIntegration: true,
                    allowRunningInsecureContent: serve,
                    webSecurity: false
                },
                center: true,
                transparent: true
            });

            childs[route].removeMenu();

            childs[route].once('close', () => {
                childs[route] = null;
                event.reply('open-route-reply', 'close');
            });

            loadApp(childs[route], `#/${route}`);
        } else {
            childs[route].show();
        }

        childs[route].once('hide', () => {
            event.reply('open-route-reply', 'hide');
        });
    }
    catch (error) {
        event.reply('open-route-reply', error);
    }
});

function loadApp(self: BrowserWindow, route: string = '') {
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        self.loadURL('http://localhost:4200' + route);
    }
    else {
        const appUrl = url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        });
        self.loadURL(appUrl + route);
    }

    if (serve) {
        self.webContents.openDevTools({ mode: 'undocked' });
    }
}

/* tray */

function createTray(): Tray {
    const iconFolder = serve ? 'src' : 'dist';
    const iconFile = /^win/.test(process.platform) ? 'favicon.ico' : 'favicon.png';
    tray = new Tray(path.join(__dirname, iconFolder, iconFile));

    const items: MenuItemConstructorOptions[] = [
        {
            label: 'Settings', type: 'normal',
            click: () => send('show-user-settings'),
        },
        {
            label: 'Reset Zoom', type: 'normal',
            click: () => send('reset-zoom'),
        },
        {
            label: 'Relaunch', type: 'normal',
            click: () => send('app-relaunch')
        },
        {
            label: 'Hardware Acceleration', type: 'checkbox',
            checked: state.hardwareAcceleration, click: () => {
                state.hardwareAcceleration = !state.hardwareAcceleration;
                send('app-relaunch');
            }
        },
        {
            label: 'Changelog', type: 'normal',
            click: () => showChangelog(),
        },
        {
            label: 'Exit', type: 'normal',
            click: () => send('app-quit')
        }
    ];

    if (serve) {
        items.splice(1, 0, {
            label: 'Ignore Mouse Events', type: 'normal',
            click: () => win.setIgnoreMouseEvents(true),
        });
    };

    menu = Menu.buildFromTemplate(items);
    tray.setToolTip(`PoE Overlay: ${app.getVersion()}`);
    tray.setContextMenu(menu);
    tray.on('double-click', () => win.webContents.send('show-user-settings'));
    return tray;
}

try {
    app.on('ready', () => {
        /* delay create window in order to support transparent windows at linux. */
        setTimeout(() => {
            createWindow();
            createTray();
        }, 300);
        setUserAgent();
    });

    app.on('window-all-closed', () => {
        hook.unregister();
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
