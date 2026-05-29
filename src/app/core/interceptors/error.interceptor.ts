import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error(this.resolveErrorMessage(error));
        return throwError(() => error);
      }),
    );
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }

    const backendDetail = this.readBackendDetail(error.error);
    if (backendDetail) {
      return backendDetail;
    }

    if (error.status === 401) {
      return 'No autorizado. Por favor, inicia sesión nuevamente.';
    }

    if (error.status === 403) {
      return 'No tienes permiso para acceder a este recurso.';
    }

    if (error.status === 404) {
      return 'No hay información disponible.';
    }

    return 'No se pudo procesar la solicitud. Inténtalo nuevamente.';
  }

  private readBackendDetail(payload: unknown): string | null {
    if (typeof payload !== 'object' || payload === null) {
      return null;
    }

    const record = payload as Record<string, unknown>;

    if (typeof record['detail'] === 'string') {
      return record['detail'];
    }

    if (Array.isArray(record['detail'])) {
      const messages = record['detail']
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          }

          if (typeof item === 'object' && item !== null) {
            const detailRecord = item as Record<string, unknown>;
            if (typeof detailRecord['msg'] === 'string') {
              return detailRecord['msg'];
            }
          }

          return null;
        })
        .filter((item): item is string => Boolean(item));

      if (messages.length > 0) {
        return messages.join('\n');
      }
    }

    const error = record['error'];
    if (typeof error === 'object' && error !== null) {
      const errorRecord = error as Record<string, unknown>;
      if (typeof errorRecord['message'] === 'string') {
        return errorRecord['message'];
      }
    }

    if (typeof record['message'] === 'string') {
      return record['message'];
    }

    return null;
  }
}
