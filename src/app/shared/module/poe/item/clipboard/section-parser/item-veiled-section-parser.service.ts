import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemVeiledSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Veiled, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const veiledPrefix = `${this.clientString.translate('ItemDisplayVeiledPrefix')}`;
        const veiledSuffix = `${this.clientString.translate('ItemDisplayVeiledSuffix')}`;

        const lines = sections.reduce((a, b) => a.concat(b.lines), [] as string[]);
        const veiledSection = lines.find(line => line.startsWith(veiledPrefix) || line.startsWith(veiledSuffix));
        if (!veiledSection) {
            return null;
        }

        target.veiled = true;
        // do not remove section because it's the explicit section
        return null;
    }
}
