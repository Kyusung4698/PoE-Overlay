import AutoLaunch from 'auto-launch';
import { app, BrowserWindow, dialog, Display, ipcMain, Menu, MenuItem, MenuItemConstructorOptions, screen, systemPreferences, Tray } from 'electron';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import { Window } from 'node-window-manager';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';
import * as hook from './hook';

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

log.transports.file.level = 'info';
Object.assign(console, log.functions);

log.info('App starting...');

let animationPath = path.join(app.getPath('userData'), 'animation.flag');
let animationExists = fs.existsSync(animationPath);

log.info(`App checking animation flag: ${animationExists}.`);

if (animationExists) {
    app.disableHardwareAcceleration();
    log.info('App started with disabled hardware acceleration.');
}

let keyboardPath = path.join(app.getPath('userData'), 'keyboard.flag');
let keyboardExists = fs.existsSync(keyboardPath);

log.info(`App checking keyboard flag: ${keyboardExists}.`);

let versionPath = path.join(app.getPath('userData'), 'version.txt');
let versionExists = fs.existsSync(versionPath);

let versionUpdated = true;
if (versionExists) {
    const version = fs.readFileSync(versionPath, 'utf-8').trim();
    versionUpdated = version !== app.getVersion();
    log.info(`App checking version: ${version} -> ${app.getVersion()}, ${versionUpdated}`);
}
if (versionUpdated) {
    fs.writeFileSync(versionPath, app.getVersion())
}

autoUpdater.logger = log;
autoUpdater.autoInstallOnAppQuit = true;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

log.info('App args', args);
log.info('App served', serve);

const launch = new AutoLaunch({
    name: 'PoE Overlay'
});

let win: BrowserWindow = null;
let tray: Tray = null;
let menu: Menu = null;
let downloadItem: MenuItem = null;
let checkForUpdatesHandle = null;
let gameWindow: Window = null;

const childs: {
    [key: string]: BrowserWindow
} = {};


/* helper */

function getDisplay(): Display {
    return screen.getPrimaryDisplay();
}

function send(channel: string, ...args: any[]) {
    try {
        win.webContents.send(channel, ...args);
    }
    catch (error) {
        log.error(`could not send to '${channel}' with args '${JSON.stringify(args)}`);
    }
}

/* robot js */

ipcMain.on('click-at', (event, button, position) => {
    if (position) {
        robot.moveMouse(position.x, position.y);
    }
    robot.mouseClick(button, false);
    event.returnValue = true;
});

ipcMain.on('mouse-pos', (event) => {
    event.returnValue = robot.getMousePos()
});

ipcMain.on('key-tap', (event, key, modifier) => {
    robot.keyTap(key, modifier);
    event.returnValue = true;
});

ipcMain.on('key-toggle', (event, key, down, modifier) => {
    robot.keyToggle(key, down, modifier);
    event.returnValue = true;
});

ipcMain.on('set-keyboard-delay', (event, delay) => {
    robot.setKeyboardDelay(delay);
    event.returnValue = true;
});

/* hook */

ipcMain.on('force-active', event => {
    if (keyboardExists) {
        gameWindow?.bringToTop();
    }
    event.returnValue = true;
})

ipcMain.on('register-active-change', event => {
    hook.on('change', (active, activeWindow, bounds) => {
        gameWindow = activeWindow;

        send('active-change', serve ? true : active);

        if (win && active) {
            win.setAlwaysOnTop(false);
            win.setVisibleOnAllWorkspaces(false);

            win.setAlwaysOnTop(true, 'pop-up-menu', 1);
            win.setVisibleOnAllWorkspaces(true);

            if (JSON.stringify(bounds) !== JSON.stringify(win.getBounds())) {
                win.setBounds(bounds);
                log.info('set bounds to: ', win.getBounds());
            }
        }

    });
    event.returnValue = true;
});

ipcMain.on('register-shortcut', (event, accelerator) => {
    switch (accelerator) {
        case 'CmdOrCtrl + MouseWheelUp':
        case 'CmdOrCtrl + MouseWheelDown':
            hook.on('wheel', e => {
                if (e.ctrlKey) {
                    const channel = `shortcut-CmdOrCtrl + ${e.rotation === -1 ? 'MouseWheelUp' : 'MouseWheelDown'}`;
                    send(channel);
                }
            });
            break;
    }
    event.returnValue = true;
});

ipcMain.on('unregister-shortcut', (event, accelerator) => {
    switch (accelerator) {
        case 'CmdOrCtrl + MouseWheelUp':
        case 'CmdOrCtrl + MouseWheelDown':
            hook.off('wheel');
            break;
    }
    event.returnValue = true;
});

/* auto-updater */

autoUpdater.on('update-available', () => {
    send('app-update-available');
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
    send('app-update-downloaded');
    tray?.displayBalloon({
        iconType: 'info',
        title: 'Update ready to install',
        content: 'The new update is now ready to install. Please relaunch your application.',
    });
});

ipcMain.on('app-download-init', (event, autoDownload) => {
    autoUpdater.autoDownload = autoDownload;
    if (!serve) {
        autoUpdater.checkForUpdates();
        checkForUpdatesHandle = setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 1000 * 60 * 5);
    }
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

ipcMain.on('app-version', event => {
    const version = app.getVersion();
    event.returnValue = version;
});

/* auto-launch */

ipcMain.on('app-auto-launch-enabled', event => {
    launch.isEnabled()
        .then((enabled: boolean) => event.sender.send('app-auto-launch-enabled-result', enabled))
        .catch(() => event.sender.send('app-auto-launch-enabled-result', false));
});

ipcMain.on('app-auto-launch-change', (event, enabled) => {
    (enabled ? launch.enable() : launch.disable())
        .then(() => event.sender.send('app-auto-launch-change-result', true))
        .catch(() => event.sender.send('app-auto-launch-change-result', false));
})

/* change log */
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
        focusable: keyboardExists,
        skipTaskbar: true,
        show: false
    });
    win.removeMenu();
    win.setIgnoreMouseEvents(true);

    win.setAlwaysOnTop(true, 'pop-up-menu', 1);
    win.setVisibleOnAllWorkspaces(true);

    win.once('show', () => {
        if (versionUpdated) {
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
            const bounds = win.getBounds();
            childs[route] = new BrowserWindow({
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
                modal: true,
                parent: win,
                show: false
            });

            childs[route].removeMenu();

            childs[route].once('ready-to-show', () => {
                childs[route].show()
            });

            childs[route].once('closed', () => {
                childs[route] = null;
            });

            loadApp(childs[route], `#/${route}`);
        } else {
            childs[route].show();
        }

        childs[route].once('hide', () => {
            event.reply('open-route-reply', 'closed');
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
            label: 'Keyboard Support (experimental)', type: 'checkbox',
            checked: keyboardExists, click: () => {
                if (keyboardExists) {
                    fs.unlinkSync(keyboardPath);
                } else {
                    fs.writeFileSync(keyboardPath, 'true');
                }
                send('app-relaunch');
            }
        },
        {
            label: 'Hardware Acceleration', type: 'checkbox',
            checked: !animationExists, click: () => {
                if (animationExists) {
                    fs.unlinkSync(animationPath);
                } else {
                    fs.writeFileSync(animationPath, 'true');
                }
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
            hook.register().then(success => {
                if (!success) {
                    dialog.showErrorBox(
                        'Iohook is required to run PoE Overlay',
                        'Iohook could not be loaded. Please make sure you have vc_redist installed and try again.');
                    app.quit();
                } else {
                    createWindow();
                    createTray();
                }
            });
        }, 300);
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
