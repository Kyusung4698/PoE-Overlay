import { Pipe, PipeTransform } from '@angular/core';
import { ClientStringService } from '../service/client-string/client-string.service';
import { Language } from '../type';

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
