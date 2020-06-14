import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '@data/poe/schema';
import { ClientStringService } from './client-string.service';

@Pipe({
    name: 'clientString'
})
export class ClientStringPipe implements PipeTransform {
    constructor(private readonly clientString: ClientStringService) {
    }

    public transform(value: string, language: Language): string {
        return this.clientString.translate(value, language);
    }
}
