import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as hotkeys from 'hotkeys';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';
import { version } from './package.json';

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

/* robot js */

ipcMain.on('key-tap', (event, key, modifier) => {
    robot.keyTap(key, modifier);
    event.returnValue = true;
});

ipcMain.on('set-keyboard-delay', (event, delay) => {
    robot.setKeyboardDelay(delay);
    event.returnValue = true;
});

/* hotkeys */

ipcMain.on('register-shortcut', (event, shortcut) => {
    hotkeys.register(shortcut, () => {
        win.webContents.send('shortcut-' + shortcut);
    });
    event.returnValue = true;
});

ipcMain.on('unregister-shortcut', (event, shortcut) => {
    hotkeys.unregister(shortcut);
    event.returnValue = true;
});

ipcMain.on('unregisterall-shortcut', (event) => {
    hotkeys.unregisterall();
    event.returnValue = true;
});

ipcMain.on('register-active-change', (event) => {
    hotkeys.on(active => {
        win.webContents.send('active-change', active);
    });
    event.returnValue = true;
});

/* main window */

let win: BrowserWindow = null;

function createWindow(): BrowserWindow {
    // Create the browser window.
    win = new BrowserWindow({
        fullscreen: true,
        transparent: true,
        frame: false,
        resizable: false,
        movable: false,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            webSecurity: false
        },
        focusable: false,
        show: false,
    });
    win.removeMenu();
    win.setIgnoreMouseEvents(true);
    win.setAlwaysOnTop(true, 'screen-saver');

    loadApp(win);

    win.on('closed', () => {
        win = null;
    });

    return win;
}

/* modal window */

let childs: {
    [key: string]: BrowserWindow
} = {};

ipcMain.on('open-route', (event, route) => {
    try {
        if (!childs[route]) {
            // Create the child browser window.
            childs[route] = new BrowserWindow({
                fullscreen: true,
                transparent: true,
                frame: false,
                resizable: false,
                movable: false,
                webPreferences: {
                    nodeIntegration: true,
                    allowRunningInsecureContent: (serve) ? true : false,
                    webSecurity: false
                },
                modal: true,
                parent: win,
                show: false
            });
            childs[route].removeMenu();

            loadApp(childs[route], `#/${route}`);

            childs[route].once('ready-to-show', () => {
                childs[route].show()
            });

            childs[route].once('closed', () => {
                childs[route] = null;
            });
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
        win.webContents.openDevTools({mode: 'undocked'});
    }
}

/* tray */

let tray: Tray;

function createTray(): Tray {
    tray = serve
        ? new Tray(path.join(__dirname, 'src/favicon.ico'))
        : new Tray(path.join(__dirname, 'dist/favicon.ico'));

    const menu = Menu.buildFromTemplate([
        {
            label: 'Open Settings',
            type: 'normal',
            click: () => win.webContents.send('show-user-settings'),
        },
        {
            label: 'Restore Focus',
            type: 'normal',
            click: () => win.setIgnoreMouseEvents(true),
        },
        {
            label: 'Exit',
            type: 'normal',
            click: () => app.quit()
        }
    ]);
    tray.setToolTip(`PoE-Overlay: ${version}`);
    tray.setContextMenu(menu);
    return tray;
}

try {
    app.on('ready', () => {
        hotkeys.beginListener(!serve);
        createWindow();
        createTray();
    });

    app.on('window-all-closed', () => {
        hotkeys.removeListener();
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

