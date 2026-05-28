import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { CriticalCase, ExecutiveSummary } from '../../core/models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClientService) {}

  getCriticalCases(limit: number = 20, format: string = 'json'): Observable<{ total: number; items: CriticalCase[] }> {
    return this.http.get<{ total: number; items: CriticalCase[] }>(API_ENDPOINTS.reports.criticalCases, {
      limit,
      format,
    });
  }

  getExecutiveSummary(fechaDesde: string, fechaHasta: string, includeAi: boolean = true): Observable<ExecutiveSummary> {
    return this.http.post<ExecutiveSummary>(API_ENDPOINTS.reports.executiveSummary, {
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      include_ai_summary: includeAi,
    });
  }
}
