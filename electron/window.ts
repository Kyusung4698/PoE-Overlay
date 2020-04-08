import { Rectangle } from 'electron';
import { addon, windowManager } from 'node-window-manager';

export interface Window {
    processId: number;
    path: string;
    title: () => string;
    bounds: () => Rectangle;
    bringToTop: () => void;
}

// macos only - probably not needed for now
windowManager.requestAccessibility();

export function getActiveWindow(): Window {
    try {

        const active = windowManager.getActiveWindow();
        if (!active) {
            return undefined;
        }

        return {
            processId: active.processId,
            path: active.path,
            bounds: () => addon.getWindowBounds(active.id),
            title: () => active.getTitle(),
            bringToTop: () => active.bringToTop()
        };
    } catch (error) {
        console.warn('Could not get active window.', error);
        return undefined;
    }
}