import { AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Notification, NotificationService } from '@app/notification';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-notification-window',
  templateUrl: './notification-window.component.html',
  styleUrls: ['./notification-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationWindowComponent implements OnInit, AfterViewInit {
  private timeout: any;

  public message$ = new Subject<string>();
  public shown$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly ngZone: NgZone) { }

  public ngOnInit(): void {
    this.notificationService.notification$.on(notification => {
      this.ngZone.run(() => this.updateNotification(notification));
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateNotification(
        this.notificationService.notification$.get()
      );
    });
  }

  private updateNotification(notification: Notification): void {
    if (!notification?.message) {
      return;
    }

    if (this.shown$.value) {
      this.shown$.next(false);
      setTimeout(() => {
        this.message$.next(notification.message);
        this.shown$.next(true);
      }, 220);
    } else {
      this.message$.next(notification.message);
      this.shown$.next(true);
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.shown$.next(false), notification.duration);
  }
}
