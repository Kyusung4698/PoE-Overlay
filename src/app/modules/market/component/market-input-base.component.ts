import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeSearchRequest } from '@shared/module/poe/trade';

const JS_NAME_REGEX = /([a-zA-Z_]+)(?:\[(\d+)\])?/;

@Component({
    template: ''
})
export abstract class MarketInputBaseComponent {
    private _request: TradeSearchRequest;

    public get request(): TradeSearchRequest {
        return this._request;
    }

    @Input()
    public set request(request: TradeSearchRequest) {
        this._request = request;
        this.update();
    }

    @Input()
    public prefix = 'query.filters';

    @Input()
    public path: string;

    protected setValue(name: string, value: any): void {
        const path = [this.prefix, this.path, name].filter(x => x?.length).join('.');
        if (value !== undefined && value !== null) {
            path.split('.')
                .reduce((current, key, index, keys) => {
                    if (keys.length === index + 1) {
                        return this.writeValue(current, key, value);
                    }
                    return this.writeValue(current, key);
                }, this.request);
        } else {
            const keys = path.split('.');

            let current = this.request;
            const references: {
                obj: any,
                key: string
            }[] = [{
                obj: current,
                key: undefined
            }];

            for (const key of keys) {
                const obj = this.accessValue(current, key, true);
                if (!obj) {
                    break;
                }

                references.push({ obj, key });
                current = obj;
            }

            for (let i = references.length - 1; i > 0; --i) {
                const reference = references[i];
                if (typeof reference.obj === 'object') {
                    const props = Object.getOwnPropertyNames(reference.obj);
                    if (props.length === 0) {
                        delete references[i - 1].obj[reference.key];
                    } else {
                        break;
                    }
                } else {
                    delete references[i - 1].obj[reference.key];
                }
            }
        }
    }

    protected getValue(name: string): any {
        const path = [this.prefix, this.path, name].filter(x => x?.length).join('.');
        return path.split('.')
            .reduce((current, key, index, keys) => {
                const isLast = keys.length === index + 1;
                return this.accessValue(current, key, isLast);
            }, this.request);
    }

    protected abstract update(): void;

    private writeValue(obj: any, key: string, value?: any): any {
        const [, name, index] = JS_NAME_REGEX.exec(key);
        if (index) {
            if (!obj[name]) {
                obj[name] = [];
            }
            if (value) {
                return obj[name][index] = value;
            }
            return obj[name][index] ?? (obj[name][index] = {});
        } else {
            if (value) {
                return obj[name] = value;
            }
            return obj[name] ?? (obj[name] = {});
        }
    }

    private accessValue(obj: any, key: string, isLast: boolean): any {
        const [, name, arrayIndex] = JS_NAME_REGEX.exec(key);
        if (arrayIndex) {
            if (isLast) {
                return obj[name][arrayIndex];
            }
            return (obj[name] || [])[arrayIndex] || {};
        } else {
            if (isLast) {
                return obj[name];
            }
            return obj[name] || {};
        }
    }
}
