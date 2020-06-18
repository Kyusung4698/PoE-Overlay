
type Callback<TEvent> = (event: TEvent) => void;
export interface EventSubscription {
    unsubscribe(): void;
}

export class EventEmitter<TEvent> {
    private readonly registry: {
        [key: string]: Callback<TEvent>;
    } = {};
    private latest: TEvent;
    private counter = 0;

    constructor(first?: TEvent) {
        this.latest = first;
    }

    public get(): TEvent {
        return this.latest;
    }

    public next(event: TEvent): void {
        Object.getOwnPropertyNames(this.registry).forEach(key => {
            const fn = this.registry[key];
            if (fn) {
                fn(event);
            }
        });
        this.latest = event;
    }

    public on(callback: Callback<TEvent>): EventSubscription {
        const id = ++this.counter;
        this.registry[id] = callback;
        return {
            unsubscribe: () => delete this.registry[id]
        };
    }
}
