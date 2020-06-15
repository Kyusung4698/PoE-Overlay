import { Observable } from 'rxjs';
import { flatMap, shareReplay, delay } from 'rxjs/operators';
import { OWAudio } from './ow-audio';

export class OWAudioFile {
    private id$: Observable<string>;

    constructor(private readonly url: string) { }

    public play(): Observable<void> {
        return this.ensure().pipe(
            flatMap(id => OWAudio.play(id))
        );
    }

    public resume(): Observable<void> {
        return this.ensure().pipe(
            flatMap(id => OWAudio.resume(id))
        );
    }

    public stop(): Observable<void> {
        return this.ensure().pipe(
            flatMap(id => OWAudio.stop(id))
        );
    }

    public setVolume(volume: number): Observable<void> {
        return this.ensure().pipe(
            flatMap(() => OWAudio.setVolume(volume))
        );
    }

    private ensure(): Observable<string> {
        if (!this.id$) {
            this.id$ = OWAudio.create(this.url).pipe(
                shareReplay(1)
            );
        }
        return this.id$;
    }
}