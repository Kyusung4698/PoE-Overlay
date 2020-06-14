import { Injectable } from '@angular/core';
import { ClientStringService } from '../../../client-string';
import { Item, ItemSocket, ItemSocketColor } from '../../item';
import { ItemSection } from './item-section';
import { ItemSectionParserService } from './item-section-parser.service';
import { ItemSectionType } from './item-section-type';

@Injectable({
    providedIn: 'root'
})
export class ItemSocketsSectionParserService extends ItemSectionParserService {
    constructor(private readonly clientString: ClientStringService) {
        super(ItemSectionType.Sockets, true);
    }

    public parse(sections: ItemSection[], target: Item): ItemSection {
        const phrase = `${this.clientString.translate('ItemDisplayStringSockets')}: `;

        const socketsSection = sections.find(x => x.content.startsWith(phrase));
        if (!socketsSection) {
            return null;
        }

        target.sockets = [];

        // R-G-B-W R R
        const sockets = socketsSection.lines[0].slice(phrase.length);
        for (let index = 0; index < sockets.length; index += 2) {
            const socket: ItemSocket = {
                color: sockets[index] as ItemSocketColor,
                linked: sockets[index + 1] === '-'
            };
            target.sockets.push(socket);
        }
        return socketsSection;
    }
}
