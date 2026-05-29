import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { AppErrorDialog, AppNotification, NotificationService } from './core/services/notification.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AppModalComponent } from './shared/components/modal/app-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingSpinnerComponent, AppModalComponent],
  template: `
    <div class="app-root">
      <router-outlet></router-outlet>

      <div *ngIf="isLoading$ | async" class="global-loading">
        <app-loading-spinner message="Analizando información"></app-loading-spinner>
      </div>

      <div class="notification-stack" aria-live="polite">
        <div
          *ngFor="let notification of notifications()"
          class="notification"
          [ngClass]="'notification--' + notification.type"
        >
          <p>{{ notification.message }}</p>
          <button type="button" (click)="onCloseNotification(notification.id)" aria-label="Cerrar notificación">
            ×
          </button>
        </div>
      </div>

      <app-modal
        [isOpen]="!!errorDialog()"
        [title]="errorDialog()?.title || 'Error'"
        [showConfirm]="false"
        cancelLabel="Entendido"
        (close)="onCloseErrorDialog()"
      >
        <p class="body-text" style="white-space: pre-line">{{ errorDialog()?.message }}</p>
      </app-modal>
    </div>
  `,
})
export class AppComponent {
  isLoading$;
  notifications = signal<AppNotification[]>([]);
  errorDialog = signal<AppErrorDialog | null>(null);

  constructor(
    loadingService: LoadingService,
    private notificationService: NotificationService,
  ) {
    this.isLoading$ = loadingService.loading$;

    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications.set(notifications);
    });

    this.notificationService.errorDialog$.subscribe((dialog) => {
      this.errorDialog.set(dialog);
    });
  }

  onCloseNotification(id: string): void {
    this.notificationService.remove(id);
  }

  onCloseErrorDialog(): void {
    this.notificationService.closeErrorDialog();
  }
}
