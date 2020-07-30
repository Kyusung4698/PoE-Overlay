import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ContextService } from '@shared/module/poe/context';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../item';

@Component({
    selector: 'app-item-frame',
    templateUrl: './item-frame.component.html',
    styleUrls: ['./item-frame.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameComponent implements OnInit {
    @Input()
    public item: Item;

    @Input()
    public queryItem: Item;

    @Output()
    public queryItemChange = new EventEmitter<Item>();

    @Input()
    public language?: Language;

    @Input()
    public separator = false;

    @Input()
    public propertyMinRange = 0.1;

    @Input()
    public propertyMaxRange = 0.5;

    @Input()
    public modifierMinRange = 0.1;

    @Input()
    public modifierMaxRange = 0.5;

    @Input()
    public opacity = 0.8;

    @Input()
    public properties: [];

    public req: boolean;
    public sockets: boolean;
    public stats: boolean;
    public state: boolean;
    public influences: boolean;

    public text$ = new BehaviorSubject<boolean>(false);

    constructor(private readonly context: ContextService) { }

    public ngOnInit(): void {
        this.language = this.language || this.context.get().language;
        this.queryItem = this.queryItem || {
            influences: {},
            damage: {},
            stats: [],
            properties: {},
            requirements: {},
            sockets: new Array((this.item.sockets || []).length).fill({})
        };
        this.req = !!(this.item.level || this.item.requirements);
        const sockets = !!(this.item.sockets && this.item.sockets.length > 0);
        const icon = !!this.item.icon?.length && this.item.width !== undefined && this.item.height !== undefined;
        this.sockets = sockets || icon;
        this.stats = !!(this.item.stats && this.item.stats.length > 0);
        this.state = !!(this.item.corrupted !== undefined || this.item.veiled !== undefined || this.item.unidentified !== undefined);
        this.influences = !!this.item.influences;

        if (this.queryItemChange.observers.length === 0) {
            this.text$.next(true);
        }
    }

    // public onMouseDown(event: MouseEvent): void {
    //     if (this.queryItemChange.observers.length > 0 && event.button === 2) {
    //         this.text$.next(true);
    //     }
    // }

    // public onMouseUp(event: MouseEvent): void {
    //     if (this.queryItemChange.observers.length > 0 && event.button === 2) {
    //         this.text$.next(false);
    //     }
    // }

    public onPropertyChange(): void {
        this.queryItemChange.emit(this.queryItem);
    }
}
