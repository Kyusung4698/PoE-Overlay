import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Language } from '@data/poe/schema';
import { Item } from '../../item';

@Component({
    selector: 'app-item-frame-level-requirements',
    templateUrl: './item-frame-level-requirements.component.html',
    styleUrls: ['./item-frame-level-requirements.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameLevelRequirementsComponent {
    @Input()
    public item: Item;

    @Input()
    public queryItem: Item;

    @Input()
    public language: Language;
}
