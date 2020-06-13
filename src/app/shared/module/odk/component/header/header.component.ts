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

  public pinned = false;

  @Input()
  public name: string;

  @Input()
  public inline = false;

  @Input()
  public closeable = true;

  @Input()
  public draggable = true;

  @Input()
  public pinnable = false;

  @Input()
  public width: number;

  public ngOnInit(): void {
    this.obtained$ = this.window.assureObtained()
      .pipe(
        map(() => true),
        shareReplay(1)
      );
  }

  public onDrag(event: MouseEvent): void {
    event.preventDefault();
    if (this.pinned) {
      return;
    }
    this.obtained$.subscribe(() => {
      this.window.dragMove();
    });
  }

  public onClose(event: MouseEvent): void {
    event.preventDefault();
    this.window.close().subscribe();
  }

  public onPinned(event: MouseEvent): void {
    event.preventDefault();
    this.pinned = !this.pinned;
  }
}
