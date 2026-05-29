import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, QueryParams } from '../models/api-response.model';
import { EnvironmentService } from './environment.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
    private notificationService: NotificationService,
  ) {}

  get<T>(endpoint: string, params?: QueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T> | T>(this.buildUrl(endpoint), { params: this.buildParams(params) })
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  post<T>(endpoint: string, body?: unknown, params?: QueryParams): Observable<T> {
    return this.http
      .post<ApiResponse<T> | T>(this.buildUrl(endpoint), body ?? {}, { params: this.buildParams(params) })
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T> | T>(this.buildUrl(endpoint), body)
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T> | T>(this.buildUrl(endpoint), body)
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T> | T>(this.buildUrl(endpoint))
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  uploadFile<T>(endpoint: string, file: File, params?: QueryParams): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<T> | T>(this.buildUrl(endpoint), formData, { params: this.buildParams(params) })
      .pipe(map((response) => this.unwrapResponse(response)), catchError((error) => this.handleError(error)));
  }

  private buildUrl(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }

    const baseUrl = this.environmentService.apiBaseUrl.replace(/\/+$/, '');
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const hasApiSegment = /\/api(?:\/|$)/i.test(baseUrl);
    const apiPrefix = hasApiSegment ? '' : '/api';

    return `${baseUrl}${apiPrefix}${normalizedEndpoint}`;
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  private unwrapResponse<T>(response: ApiResponse<T> | T): T {
    if (this.isApiResponse(response)) {
      if (!response.success || response.error) {
        throw new Error(
          response.error?.message ??
            response.message ??
            'No se pudo procesar la solicitud. Inténtalo nuevamente.',
        );
      }

      return response.data as T;
    }

    return response;
  }

  private isApiResponse<T>(response: ApiResponse<T> | T): response is ApiResponse<T> {
    return typeof response === 'object' && response !== null && 'success' in response;
  }

  private handleError(error: unknown): Observable<never> {
    if (!(error instanceof HttpErrorResponse)) {
      const message = error instanceof Error ? error.message : 'No se pudo procesar la solicitud. Inténtalo nuevamente.';
      this.notificationService.error(message);
    }

    return throwError(() => error);
  }
}
