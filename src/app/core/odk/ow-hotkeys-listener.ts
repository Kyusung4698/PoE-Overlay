import { OWHotkeys } from './ow-hotkeys';
import { OnPressedEvent } from './ow-types';

export interface OWHotkeysListenerDelegate {
    onPressed(event: OnPressedEvent): void;
}

export class OWHotkeysListener {
    constructor(private readonly delegate: OWHotkeysListenerDelegate) { }

    public start(): void {
        OWHotkeys.onPressed.addListener(this.onPressed);
    }

    public stop(): void {
        OWHotkeys.onPressed.removeListener(this.onPressed);
    }

    private onPressed = (event: OnPressedEvent): void => {
        this.delegate.onPressed(event);
    }
}
