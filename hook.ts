import activeWin from 'active-win';
import iohook from 'iohook';
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

let active = false;
let activeChangeFn: (active: boolean) => void;
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
    }

    if (old !== active) {
        if (activeChangeFn) {
            activeChangeFn(active);
        }
    }
}

export function getActive(): boolean {
    return active;
}

export function on(event: 'change', callback: (active: boolean) => void): void;
export function on(event: 'wheel', callback: (event: WheelEvent) => void): void;

export function on(event: string, callback: any) {
    switch (event) {
        case 'change':
            activeChangeFn = callback;
            activeChangeFn(active);
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

export function register(): void {
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
}

export function unregister(): void {
    iohook.off('keydown', onKeydown);
    iohook.off('keyup', onKeyup);
    iohook.off('mousewheel', onMousewheel);
    iohook.off('mouseup', onMouseclick);

    if (activeCheckSubscription) {
        activeCheckSubscription.unsubscribe();
    }

    iohook.stop();
}