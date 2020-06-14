import { Injectable } from '@angular/core';
import { EventEmitter } from '@app/event';
import { ProcessStorageService } from '@app/storage';
import { Notification } from './notification';

const NOTIFICATION_DATA_KEY = 'NOTIFICATION_DATA';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private readonly storage: ProcessStorageService) { }

    public get notification$(): EventEmitter<Notification> {
        return this.storage.get(NOTIFICATION_DATA_KEY, () => new EventEmitter<Notification>());
    }

    public show(message: string, duration: number = 1000 * 3): void {
        const notification: Notification = {
            message,
            duration
        };
        this.notification$.next(notification);
    }
}
