import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Item } from '../../item';

@Component({
    selector: 'app-item-frame-header',
    templateUrl: './item-frame-header.component.html',
    styleUrls: ['./item-frame-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameHeaderComponent {
    @Input()
    public item: Item;

    @Input()
    public queryItem: Item;

    @Input()
    public queryable: boolean;

    @Input()
    public language: Language;
}
