import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';

/* robot js */

ipcMain.on('key-tap', (event, key, modifier) => {
    robot.keyTap(key, modifier);
    event.returnValue = true;
});

ipcMain.on('set-keyboard-delay', (event, delay) => {
    robot.setKeyboardDelay(delay);
    event.returnValue = true;
});

/* main window */

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

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
    });
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
        win.webContents.openDevTools();
    }
}

try {
    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
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

