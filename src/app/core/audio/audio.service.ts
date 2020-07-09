import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';

interface AudioPlayEvent {
    file: string;
    volume: number;
}

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private readonly audio: HTMLAudioElement;
    private readonly queue$ = new Subject<AudioPlayEvent>();

    constructor() {
        this.audio = document.createElement('audio');
        this.init();
    }

    public play(file: string, volume: number = 1): void {
        this.queue$.next({ file, volume });
    }

    private init(): void {
        this.queue$.pipe(
            throttleTime(500),
            tap(event => {
                this.audio.pause();
                this.audio.src = event.file;
                this.audio.currentTime = 0;
                this.audio.volume = event.volume;
                this.audio.play();
            })
        ).subscribe();
    }
}
