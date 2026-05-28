import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { NotificationService, Notification } from './core/services/notification.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-slate-100">
      <router-outlet></router-outlet>

      <!-- Global Loading Indicator -->
      <div *ngIf="isLoading$ | async" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
        <app-loading-spinner message="Procesando solicitud..."></app-loading-spinner>
      </div>

      <!-- Global Notifications -->
      <div class="fixed top-4 right-4 z-40 space-y-2 max-w-md">
        <div
          *ngFor="let notification of notifications()"
          [ngClass]="getNotificationClasses(notification.type)"
          class="p-4 rounded-lg shadow-lg animate-slide-in"
        >
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-medium">{{ notification.message }}</p>
            <button (click)="onCloseNotification(notification.id)" class="text-lg leading-none opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }
    `,
  ],
})
export class AppComponent {
  isLoading$;
  notifications = signal<Notification[]>([]);

  constructor(
    loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.isLoading$ = loadingService.loading$;
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications.set(notifications);
    });
  }

  onCloseNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getNotificationClasses(type: string): string {
    const classes = {
      success: 'bg-green-50 text-green-900 border border-green-200',
      error: 'bg-red-50 text-red-900 border border-red-200',
      info: 'bg-blue-50 text-blue-900 border border-blue-200',
      warning: 'bg-amber-50 text-amber-900 border border-amber-200',
    };
    return classes[type as keyof typeof classes] || classes.info;
  }
}
