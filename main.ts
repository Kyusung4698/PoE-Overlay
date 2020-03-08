import { app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions, Tray } from 'electron';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';
import * as hook from './hook';

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

app.allowRendererProcessReuse = true;

app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

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
    hook.on('change', active => {
        win.webContents.send('active-change', serve ? true : active);
    });
    event.returnValue = true;
});

ipcMain.on('register-shortcut', (event, accelerator) => {
    switch (accelerator) {
        case 'CmdOrCtrl + MouseWheelUp':
        case 'CmdOrCtrl + MouseWheelDown':
            hook.on('wheel', e => {
                if (e.ctrlKey) {
                    win.webContents.send(`shortcut-${e.rotation === -1
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
            allowRunningInsecureContent: serve,
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

let tray: Tray;

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
        // TODO: Does not work with compiled app.
        // {
        //     label: 'Relaunch', type: 'normal',
        //     click: () => {
        //         app.relaunch();
        //         app.quit();
        //     }
        // },
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

    const menu = Menu.buildFromTemplate(items);
    tray.setToolTip(`PoE-Overlay: ${app.getVersion()}`);
    tray.setContextMenu(menu);
    tray.on('double-click', () => win.webContents.send('show-user-settings'))
    return tray;
}

try {
    app.on('ready', () => {
        hook.register();
        createWindow();
        createTray();
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
