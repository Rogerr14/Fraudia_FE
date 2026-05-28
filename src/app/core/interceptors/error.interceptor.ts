import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'No se pudo procesar la solicitud. Inténtalo nuevamente.';

        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Solicitud inválida.';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permiso para acceder a este recurso.';
        } else if (error.status === 404) {
          errorMessage = 'El recurso solicitado no fue encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        }

        this.notificationService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
