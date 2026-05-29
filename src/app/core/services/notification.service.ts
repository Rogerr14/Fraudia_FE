import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface AppErrorDialog {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private errorDialogSubject = new BehaviorSubject<AppErrorDialog | null>(null);

  readonly notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();
  readonly errorDialog$: Observable<AppErrorDialog | null> = this.errorDialogSubject.asObservable();

  show(message: string, type: NotificationType = 'info', duration = 5000): void {
    const notification: AppNotification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      duration,
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.errorDialogSubject.next({
      title: 'No se pudo completar la acción',
      message,
    });

    if (duration && duration > 0) {
      this.show(message, 'error', duration);
    }
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  remove(id: string): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter((notification) => notification.id !== id));
  }

  closeErrorDialog(): void {
    this.errorDialogSubject.next(null);
  }

  clear(): void {
    this.notificationsSubject.next([]);
    this.errorDialogSubject.next(null);
  }
}
