import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardViewModel } from '../../models/dashboard.model';
import { SummaryCardsComponent } from '../../components/summary-cards/summary-cards.component';
import { RiskDistributionComponent } from '../../components/risk-distribution/risk-distribution.component';
import { TopRiskClaimsComponent } from '../../components/top-risk-claims/top-risk-claims.component';
import { ProvidersRankingComponent } from '../../components/providers-ranking/providers-ranking.component';
import { CitiesAlertsComponent } from '../../components/cities-alerts/cities-alerts.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    SummaryCardsComponent,
    RiskDistributionComponent,
    TopRiskClaimsComponent,
    ProvidersRankingComponent,
    CitiesAlertsComponent,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="page-kicker">Centro de monitoreo</p>
          <h1>Dashboard de riesgo</h1>
          <span>Resumen ejecutivo para priorizar siniestros sospechosos.</span>
        </div>
      </header>

      <app-loading-spinner *ngIf="loading()" message="Cargando dashboard..."></app-loading-spinner>

      <ng-container *ngIf="!loading() && view() as dashboardView">
        <app-summary-cards [summary]="dashboardView.summary"></app-summary-cards>

        <div class="dashboard-grid">
          <app-risk-distribution [items]="dashboardView.riskDistribution"></app-risk-distribution>
          <app-top-risk-claims [items]="dashboardView.topRiskClaims"></app-top-risk-claims>
        </div>

        <div class="dashboard-grid dashboard-grid--two">
          <app-providers-ranking [items]="dashboardView.providersRanking"></app-providers-ranking>
          <app-cities-alerts [items]="dashboardView.citiesAlerts"></app-cities-alerts>
        </div>

        <app-card title="Riesgo por ramo" eyebrow="Lectura transversal">
          <div class="branch-grid" *ngIf="dashboardView.branchRisk.length > 0; else emptyBranches">
            <div *ngFor="let branch of dashboardView.branchRisk" class="branch-card">
              <strong>{{ branch.branch }}</strong>
              <span>{{ branch.totalClaims }} siniestros</span>
              <div class="branch-card__metrics">
                <small>Rojos: {{ branch.redClaims }}</small>
                <small>Amarillos: {{ branch.yellowClaims }}</small>
                <small>Score: {{ branch.averageScore }}</small>
              </div>
            </div>
          </div>
          <ng-template #emptyBranches>
            <p class="muted-text">No hay información disponible.</p>
          </ng-template>
        </app-card>
      </ng-container>

      <app-empty-state
        *ngIf="!loading() && !view()"
        title="Carga un dataset para comenzar el análisis"
        message="Cuando el backend tenga datos, el dashboard mostrará métricas, alertas y prioridades."
      ></app-empty-state>
    </section>
  `,
})
export class DashboardPageComponent implements OnInit {
  loading = signal(true);
  view = signal<DashboardViewModel | null>(null);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardView().subscribe({
      next: (view) => {
        this.view.set(view);
        this.loading.set(false);
      },
      error: () => {
        this.view.set(null);
        this.loading.set(false);
      },
    });
  }
}
