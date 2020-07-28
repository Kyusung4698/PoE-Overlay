import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OWWindow } from '@app/odk';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { meta } from './../../../../../../../manifest.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private readonly window = new OWWindow();
  private obtained$: Observable<boolean>;

  public version = meta.version;

  @Input()
  public name: string;

  @Input()
  public inline = false;

  @Input()
  public closeable = true;

  @Input()
  public draggable = true;

  @Input()
  public contentDraggable = true;

  @Input()
  public pinnable = false;

  @Input()
  public pinned = false;

  @Output()
  public pinnedChange = new EventEmitter<boolean>();

  @Input()
  public width: number;

  @Input()
  public reverse = false;

  @Input()
  public fixed = false;

  @Input()
  public frame = true;

  @Input()
  public footer = false;

  @Output()
  public settingsToggle = new EventEmitter<void>();

  @Output()
  public supportToggle = new EventEmitter<void>();

  public ngOnInit(): void {
    this.obtained$ = this.window.assureObtained()
      .pipe(
        map(() => true),
        shareReplay(1)
      );
  }

  public onDrag(event: MouseEvent, draggable: boolean): void {
    if (!draggable || this.pinned) {
      return;
    }
    event.preventDefault();
    this.obtained$.subscribe(() => this.window.dragMove());
  }

  public onClose(event: MouseEvent): void {
    event.preventDefault();
    this.window.close().subscribe();
  }

  public onPinned(event: MouseEvent): void {
    event.preventDefault();
    this.pinned = !this.pinned;
    this.pinnedChange.next(this.pinned);
  }

  public onSettings(event: MouseEvent): void {
    event.preventDefault();
    this.settingsToggle.next();
  }
}
