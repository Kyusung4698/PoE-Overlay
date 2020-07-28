import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Item, ItemSocket } from '../../item';
import { ItemFrameComponent } from '../item-frame/item-frame.component';

@Component({
    selector: 'app-item-frame-sockets',
    templateUrl: './item-frame-sockets.component.html',
    styleUrls: ['./item-frame-sockets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameSocketsComponent {
    public readonly disabled: boolean;

    @Input()
    public item: Item;

    @Input()
    public queryItem: Item;

    constructor(
        @Inject(ItemFrameComponent)
        private readonly itemFrame: ItemFrameComponent
    ) {
        this.disabled = this.itemFrame.queryItemChange.observers.length <= 0;
    }

    public toggleSocketColor(event: MouseEvent, index: number, value: ItemSocket): void {
        if (this.disabled) {
            return;
        }

        if (event.shiftKey) {
            const enabled = this.queryItem.sockets.every(x => x.color !== undefined);
            for (let i = 0; i < this.queryItem.sockets.length; i++) {
                this.queryItem.sockets[i].color = enabled ? undefined : this.item.sockets[i].color;
            }
        } else {
            this.queryItem.sockets[index] = this.toggleSocket(this.queryItem.sockets[index], value, 'color');
        }
        this.itemFrame.onPropertyChange();
    }

    public toggleSocketLinked(event: MouseEvent, index: number, value: ItemSocket): void {
        if (this.disabled) {
            return;
        }

        if (event.shiftKey) {
            const enabled = this.queryItem.sockets.every(x => x.linked !== undefined);
            for (let i = 0; i < this.queryItem.sockets.length; i++) {
                this.queryItem.sockets[i].linked = enabled ? undefined : this.item.sockets[i].linked;
            }
        } else {
            this.queryItem.sockets[index] = this.toggleSocket(this.queryItem.sockets[index], value, 'linked');
        }
        this.itemFrame.onPropertyChange();
    }

    public getSocketTop(index: number, offset: number = 0): string {
        return `${Math.floor(index / 2) * 56 + offset}px`;
    }

    public getSocketHeight(): string {
        const length = Math.max(this.item.sockets?.length || 0, (this.item.height || 0) * 2);
        const socketHeight = Math.floor((length + 1) / 2) * 34;
        const linkHeight = length >= 3
            ? Math.floor((length - 1) / 2) * 22
            : 0;
        return `${socketHeight + linkHeight}px`;
    }

    private toggleSocket(socket: ItemSocket, value: ItemSocket, property: string): ItemSocket {
        if (!socket || !socket[property]) {
            return { ...socket, [property]: value[property] };
        }
        return { ...socket, [property]: null };
    }
}
