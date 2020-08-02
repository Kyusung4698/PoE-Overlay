import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { AnnotationMessage, AnnotationService } from '@app/annotation';
import { AnnotationWindowService } from '@layout/service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-annotation-window',
  templateUrl: './annotation-window.component.html',
  styleUrls: ['./annotation-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationWindowComponent implements OnInit {
  public message$ = new Subject<AnnotationMessage>();

  constructor(
    private readonly annotation: AnnotationService,
    private readonly window: AnnotationWindowService,
    private readonly ngZone: NgZone) { }

  public ngOnInit(): void {
    this.annotation.message$.on(message => {
      this.ngZone.run(() => this.updateMessage(message));
    });
    this.annotation.init().subscribe();
  }

  public onContinue(): void {
    this.annotation.continue().subscribe();
  }

  public onSkip(): void {
    this.annotation.skip().subscribe();
  }

  private updateMessage(message: AnnotationMessage): void {
    if (!message) {
      this.window.close().subscribe(() => {
        this.message$.next(message);
      });
    } else {
      this.message$.next(message);
    }
  }
}
