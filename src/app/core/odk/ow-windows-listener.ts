import { WindowStateChangedEvent } from './ow-types';

export interface OWWindowsListenerDelegate {
    onStateChange(event: WindowStateChangedEvent): void;
}

export class OWWindowsListener {
    constructor(
        private readonly delegate: OWWindowsListenerDelegate) { }

    public start(): void {
        this.unregisterEvents();
        this.registerEvents();
    }

    public stop(): void {
        this.unregisterEvents();
    }

    private onStateChange = (event: WindowStateChangedEvent): void => {
        this.delegate.onStateChange(event);
    }

    private registerEvents(): void {
        overwolf.windows.onStateChanged.addListener(this.onStateChange);
    }

    private unregisterEvents(): void {
        overwolf.windows.onStateChanged.removeListener(this.onStateChange);
    }
}
