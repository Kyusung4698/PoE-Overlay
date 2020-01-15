import { Injectable } from '@angular/core';
import { ExportedItem, Item, ItemSectionParserService, Section } from '@shared/module/poe/type';
import { ClientStringService } from '../../client-string/client-string.service';

@Injectable({
    providedIn: 'root'
})
export class ItemSectionVeiledParserService implements ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) { }

    public optional = true;

    public parse(item: ExportedItem, target: Item): Section {
        const veiledPrefix = `${this.clientString.translate('ItemDisplayVeiledPrefix')}`;
        const veiledSuffix = `${this.clientString.translate('ItemDisplayVeiledSuffix')}`;

        const lines = item.sections.reduce((a, b) => a.concat(b.lines), [] as string[]);
        const veiledSection = lines.find(line => line.startsWith(veiledPrefix) || line.startsWith(veiledSuffix));
        if (!veiledSection) {
            return null;
        }

        target.veiled = true;
        // do not remove section because it's the explicit section
        return null;
    }
}
