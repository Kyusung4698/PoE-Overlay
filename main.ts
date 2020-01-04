import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';

ipcMain.on('keyTap', (event, key, modifier) => {
    robot.keyTap(key, modifier);
    event.returnValue = true;
});

ipcMain.on('setKeyboardDelay', (event, delay) => {
    robot.setKeyboardDelay(delay);
    event.returnValue = true;
});

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
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            webSecurity: false
        }
    });
    win.setIgnoreMouseEvents(true);
    win.setFocusable(false);
    win.setAlwaysOnTop(true, 'screen-saver');

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    if (serve) {
        win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

try {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
