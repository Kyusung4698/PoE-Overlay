
export interface OWFileListenerDelegate {
    onLineAdd(line: string): void;
    onLineRead?(line: string): void;
    onError(error?: string): void;
}

const RESTART_DELAY = 1000 * 10;

interface OWFileListenerResult extends overwolf.Result {
    content: string;
    info: string;
}

export class OWFileListener {
    private restartHandle: any;
    private path: string;
    private skipToEnd: boolean;

    constructor(
        private readonly id: string,
        private readonly delegate: OWFileListenerDelegate) { }

    public start(path: string, skipToEnd = true): void {
        this.path = path;
        this.skipToEnd = skipToEnd;
        this.listen();
    }

    public stop(): void {
        overwolf.io.stopFileListener(this.id);
    }

    private restart(): void {
        this.stop();
        clearTimeout(this.restartHandle);
        this.restartHandle = setTimeout(() => this.listen(), RESTART_DELAY);
    }

    private listen(): void {
        overwolf.io.listenOnFile(this.id, this.path, { skipToEnd: this.skipToEnd }, this.onListenOnFile);
    }

    private onListenOnFile = (event: OWFileListenerResult): void => {
        if (!event.success || event.error) {
            this.delegate.onError(event.error);
            this.restart();
            return;
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
            this.delegate.onError(error);
            this.restart();
            return;
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
