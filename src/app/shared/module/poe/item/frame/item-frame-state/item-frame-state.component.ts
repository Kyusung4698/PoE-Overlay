import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Item } from '../../item';

@Component({
    selector: 'app-item-frame-state',
    templateUrl: './item-frame-state.component.html',
    styleUrls: ['./item-frame-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameStateComponent {
    @Input()
    public item: Item;

    @Input()
    public queryItem: Item;

    @Input()
    public language: Language;
}
