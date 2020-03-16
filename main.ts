import AutoLaunch from 'auto-launch';
import { app, BrowserWindow, Display, ipcMain, Menu, MenuItem, MenuItemConstructorOptions, screen, systemPreferences, Tray } from 'electron';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';
import * as hook from './hook';

if (!app.requestSingleInstanceLock()) {
    app.exit();
}

if (process.platform === 'win32' && !systemPreferences.isAeroGlassEnabled()) {
    alert('Aero needs to be enabled.')
    app.exit();
}

app.allowRendererProcessReuse = false;

app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

log.transports.file.level = 'info';
log.info('App starting...');

let animationPath = path.join(app.getPath('userData'), 'animation.flag');

log.info(`App checking for animation flag: ${animationPath}.`);

let animationExists = fs.existsSync(animationPath);
if (animationExists) {
    app.disableHardwareAcceleration();
    log.info('App disabled hardware acceleration');
}

autoUpdater.logger = log;

const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

const launch = new AutoLaunch({
    name: 'PoE Overlay'
});

let win: BrowserWindow = null;
let tray: Tray = null;
let menu: Menu = null;
let downloadItem: MenuItem = null;
let checkForUpdatesHandle;

const childs: {
    [key: string]: BrowserWindow
} = {};

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

ipcMain.on('register-active-change', event => {
    hook.on('change', (active, bounds) => {
        event.sender.send('active-change', serve ? true : active);

        if (active) {
            win.setAlwaysOnTop(false);
            win.setVisibleOnAllWorkspaces(false);

            win.setAlwaysOnTop(true, 'pop-up-menu', 1);
            win.setVisibleOnAllWorkspaces(true);

            if (bounds) {
                win.setBounds({
                    ...bounds
                });
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
                    event.sender.send(`shortcut-${e.rotation === -1
                        ? 'CmdOrCtrl + MouseWheelUp'
                        : 'CmdOrCtrl + MouseWheelDown'}`);
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

/* helper */

function getDisplay(): Display {
    return screen.getPrimaryDisplay();
}

/* auto-updater */

autoUpdater.on('update-available', () => {
    win.webContents.send('app-update-available');
    tray?.displayBalloon({
        iconType: 'info',
        title: 'New update available',
        content: 'A new update is available. Will be automatically downloaded unless otherwise specified.',
    });
    if (!downloadItem) {
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
    win.webContents.send('app-update-downloaded');
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

ipcMain.on('app-quit-and-install', event => {
    autoUpdater.quitAndInstall();
    event.returnValue = true;
});

ipcMain.on('app-version', event => {
    const version = app.getVersion();
    log.info('App Version: ', version)
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
        show: false
    });
    win.removeMenu();
    win.setIgnoreMouseEvents(true);

    win.setAlwaysOnTop(true, 'pop-up-menu', 1);
    win.setVisibleOnAllWorkspaces(true);

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

function loadApp(win: BrowserWindow, route: string = '') {
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200' + route);
    }
    else {
        const appUrl = url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        });
        win.loadURL(appUrl + route);
    }

    if (serve) {
        win.webContents.openDevTools({ mode: 'undocked' });
    }
}

/* tray */

function createTray(): Tray {
    tray = new Tray(path.join(__dirname, serve ? 'src/favicon.png' : 'dist/favicon.png'));

    const items: MenuItemConstructorOptions[] = [
        {
            label: 'Settings', type: 'normal',
            click: () => win.webContents.send('show-user-settings'),
        },
        {
            label: 'Reset Zoom', type: 'normal',
            click: () => win.webContents.send('reset-zoom'),
        },
        {
            label: 'Relaunch', type: 'normal',
            click: () => win.webContents.send('app-relaunch')
        },
        {
            label: 'Hardware Acceleration', type: 'checkbox',
            checked: !animationExists, click: () => {
                if (animationExists) {
                    fs.unlinkSync(animationPath);
                } else {
                    fs.writeFileSync(animationPath, 'true');
                }
                win.webContents.send('app-relaunch');
            }
        },
        {
            label: 'Exit', type: 'normal',
            click: () => app.quit()
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
            hook.register();
            createWindow();
            createTray();
        }, 1000);
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
