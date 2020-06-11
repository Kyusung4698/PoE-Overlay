import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { OWWindow } from '@app/odk';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private readonly window = new OWWindow();
  private obtained$: Observable<boolean>;

  @Input()
  public name: string;

  @Input()
  public closeable = true;

  @Input()
  public draggable = true;

  public ngOnInit(): void {
    this.obtained$ = this.window.assureObtained()
      .pipe(
        map(() => true),
        shareReplay(1)
      );
  }

  public onDrag(event: MouseEvent): void {
    event.preventDefault();
    this.obtained$.subscribe(() => {
      this.window.dragMove();
    });
  }

  public onClose(event: MouseEvent): void {
    event.preventDefault();
    this.window.close().subscribe();
  }
}
