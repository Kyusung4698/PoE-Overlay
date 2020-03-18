import activeWin from 'active-win';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

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

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

let active = false;
let bounds: Bounds = null;
let activeChangeFn: (active: boolean, bounds: Bounds) => void;
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
    let old = active;

    const win = activeWin.sync();
    const path = win?.owner?.path
    if (path) {
        const test = path.toLowerCase();
        active = test.endsWith('pathofexile_x64_kg.exe') || test.endsWith('pathofexile_kg.exe')
            || test.endsWith('pathofexile_x64steam.exe') || test.endsWith('pathofexilesteam.exe')
            || test.endsWith('pathofexile_x64.exe') || test.endsWith('pathofexile.exe');

        if (active) {
            bounds = win.bounds;
        }
    }

    if (old !== active) {
        if (activeChangeFn) {
            activeChangeFn(active, bounds);
        }
    }
}

export function getActive(): boolean {
    return active;
}

export function on(event: 'change', callback: (active: boolean, bounds: Bounds) => void): void;
export function on(event: 'wheel', callback: (event: WheelEvent) => void): void;

export function on(event: string, callback: any) {
    switch (event) {
        case 'change':
            activeChangeFn = callback;
            activeChangeFn(active, bounds);
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