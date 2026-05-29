import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../dashboard/services/dashboard.service';
import { CriticalCase, ExecutiveSummary } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private dashboardService: DashboardService) {}

  getCriticalCases(): Observable<CriticalCase[]> {
    return this.dashboardService.getTopRiskClaims(10).pipe(
      map((claims) =>
        claims.map((claim) => ({
          claimId: claim.id,
          finalScore: claim.finalScore,
          riskLevel: claim.riskLevel,
          claimedAmount: claim.claimedAmount,
          branch: claim.branch,
          mainReasons: claim.mainAlerts.length ? claim.mainAlerts : ['Caso priorizado para revisión humana.'],
          recommendation:
            claim.riskLevel === 'rojo' || claim.riskLevel === 'critico'
              ? 'Escalar a revisión antifraude.'
              : 'Revisar documentación y consistencia del caso.',
        })),
      ),
    );
  }

  getExecutiveSummary(): Observable<ExecutiveSummary> {
    return forkJoin({
      summary: this.dashboardService.getSummary(),
      providers: this.dashboardService.getProvidersRanking(5),
      alerts: this.dashboardService.getAlertRanking(5),
    }).pipe(
      map(({ summary, providers, alerts }) => {
        const now = new Date();
        const from = new Date(now);
        from.setDate(now.getDate() - 30);
        const topProvider = providers[0]?.providerName ?? 'sin proveedor dominante';
        const topAlert = alerts[0]?.title ?? 'sin alertas recurrentes';

        return {
          title: 'Resumen ejecutivo',
          period: {
            from: from.toISOString(),
            to: now.toISOString(),
          },
          metrics: {
            totalClaims: summary.totalClaims,
            redCases: summary.redClaims,
            yellowCases: summary.yellowClaims,
            highRiskAmount: summary.highRiskAmount,
          },
          summary: `Se registran ${summary.totalClaims} siniestros y ${summary.redClaims} casos de alta prioridad para revisión humana. El proveedor con mayor concentración es ${topProvider} y la alerta más frecuente es ${topAlert}.`,
          recommendations: [
            'Priorizar los casos rojos y los flujos escalados antes del cierre operativo.',
            'Validar manualmente proveedores con alta recurrencia y alertas sensibles.',
            'Usar este resumen como apoyo a la revisión humana, no como decisión automática.',
          ],
        };
      }),
    );
  }
}
