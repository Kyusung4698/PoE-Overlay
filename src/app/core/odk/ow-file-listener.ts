
export interface OWFileListenerDelegate {
    onLineAdd(line: string): void;
    onLineRead?(line: string): void;
    onError(error?: string): void;
}

interface OWFileListenerResult extends overwolf.Result {
    content: string;
    info: string;
}

export class OWFileListener {
    constructor(
        private readonly id: string,
        private readonly delegate: OWFileListenerDelegate) { }

    public start(path: string, skipToEnd = true): void {
        overwolf.io.listenOnFile(this.id, path, { skipToEnd }, this.onListenOnFile);
    }

    public stop(): void {
        overwolf.io.stopFileListener(this.id);
    }

    private onListenOnFile = (event: OWFileListenerResult): void => {
        if (!event.success || event.error) {
            return this.delegate.onError(event.error);
        }

        if (!event.info?.length) {
            return;
        }

        let info: {
            isNew: boolean
        };
        try {
            info = JSON.parse(event.info);
        } catch (error) {
            return this.delegate.onError(error);
        }

        if (info.isNew) {
            this.delegate.onLineAdd(event.content);
        } else {
            if (this.delegate.onLineRead) {
                this.delegate.onLineRead(event.content);
            }
        }
    }
}
