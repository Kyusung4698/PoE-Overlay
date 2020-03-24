import { Window, windowManager, addon } from 'node-window-manager';
import { IRectangle } from 'node-window-manager/dist/interfaces';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

windowManager.requestAccessibility();

interface KeyboardEvent {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    keycode: number;
}

interface WheelEvent {
    rotation: number;
    ctrlKey: boolean;
}

let active = false;
let activeWindow: Window = null;
let bounds: IRectangle = null;

let activeChangeFn: (active: boolean, game: Window, bounds: IRectangle) => void;
let wheelChangeFn: (event: WheelEvent) => void;

const activeCheck$ = new Subject<void>();
let activeCheckSubscription: Subscription;

function onKeydown(event: KeyboardEvent): void {
    activeCheck$.next();
}

function onKeyup(event: KeyboardEvent): void {
    activeCheck$.next();
}

function onMousewheel(event: WheelEvent): void {
    activeCheck$.next();

    if (active) {
        if (wheelChangeFn) {
            wheelChangeFn(event);
        }
    }
}

function onMouseclick(event: WheelEvent): void {
    activeCheck$.next();
}

function checkActive(): void {
    let orgActive = active;
    let orgActiveWindow = activeWindow;
    let orgBounds = bounds;

    const possibleWindow = windowManager.getActiveWindow();
    if (possibleWindow.path) {
        const lowerPath = possibleWindow.path.toLowerCase();
        active = lowerPath.endsWith('pathofexile_x64_kg.exe') || lowerPath.endsWith('pathofexile_kg.exe')
            || lowerPath.endsWith('pathofexile_x64steam.exe') || lowerPath.endsWith('pathofexilesteam.exe')
            || lowerPath.endsWith('pathofexile_x64.exe') || lowerPath.endsWith('pathofexile.exe');


        if (active) {
            activeWindow = possibleWindow;
            
            if (addon) {
                bounds = addon.getWindowBounds(activeWindow.id);
            }
        }
    }

    if (orgActive !== active ||
        orgActiveWindow?.processId !== activeWindow?.processId ||
        JSON.stringify(orgBounds) !== JSON.stringify(bounds)) {
        if (activeChangeFn) {
            activeChangeFn(active, activeWindow, bounds);
        }
    }
}

export function getActive(): boolean {
    return active;
}

export function on(event: 'change', callback: (active: boolean, game: Window, bounds: IRectangle) => void): void;
export function on(event: 'wheel', callback: (event: WheelEvent) => void): void;

export function on(event: string, callback: any) {
    switch (event) {
        case 'change':
            activeChangeFn = callback;
            activeChangeFn(active, activeWindow, bounds);
            break;
        case 'wheel':
            wheelChangeFn = callback;
            break;
    }
}

export function off(event: 'change' | 'wheel') {
    switch (event) {
        case 'change':
            activeChangeFn = undefined;
            break;
        case 'wheel':
            wheelChangeFn = undefined;
            break;
    }
}

export function register(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
        try {
            const iohook = (await import('iohook')).default;
            iohook.start();

            activeCheckSubscription = activeCheck$.pipe(
                throttleTime(500, undefined, {
                    trailing: true,
                    leading: false
                })
            ).subscribe(() => {
                checkActive();
            });

            iohook.on('keydown', onKeydown);
            iohook.on('keyup', onKeyup);
            iohook.on('mousewheel', onMousewheel);
            iohook.on('mouseup', onMouseclick);
            resolve(true);
        }
        catch (error) {
            console.error('An unexpected error occured while registering iohook', error);
            resolve(false);
        }
    })
}

export function unregister(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const iohook = (await import('iohook')).default;

            iohook.off('keydown', onKeydown);
            iohook.off('keyup', onKeyup);
            iohook.off('mousewheel', onMousewheel);
            iohook.off('mouseup', onMouseclick);

            if (activeCheckSubscription) {
                activeCheckSubscription.unsubscribe();
            }

            iohook.stop();
            resolve();
        }
        catch (error) {
            console.error('An unexpected error occured while unregistering iohook', error);
            reject();
        }
    });
}