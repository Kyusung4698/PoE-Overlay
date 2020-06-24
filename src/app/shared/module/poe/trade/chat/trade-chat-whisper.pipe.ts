import { Pipe, PipeTransform } from '@angular/core';
import { TradeWhisper, TradeWhisperDirection } from './trade-chat';

@Pipe({
    name: 'tradeWhisperTitle'
})
export class TradeWhisperTitlePipe implements PipeTransform {
    public transform(whispers: TradeWhisper[]): string {
        return `\n${whispers.map(whisper => {
            const prefix = whisper.direction === TradeWhisperDirection.Incoming ? '@From' : '@To';
            return `${whisper.timeReceived.toLocaleTimeString()} ${prefix}: ${whisper.message}`;
        }).join('\n')}`;
    }
}
