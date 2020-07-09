import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateText',
})
export class TruncateTextPipe implements PipeTransform {
    public transform(text: string, length: number, separator: string = '..'): string {
        text = text || '';
        if (text.length < length) {
            return text;
        }
        const charsToShow = length - separator.length;
        const frontChars = Math.ceil(charsToShow / 2);
        const backChars = Math.floor(charsToShow / 2);
        return `${text.substr(0, frontChars)}${separator}${text.substr(text.length - backChars)}`;
    }
}
