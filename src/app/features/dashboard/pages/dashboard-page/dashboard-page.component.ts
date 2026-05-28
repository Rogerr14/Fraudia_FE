import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { DashboardService } from '../../services/dashboard.service';
import { SummaryCardsComponent } from '../../components/summary-cards/summary-cards.component';
import { RiskDistributionComponent } from '../../components/risk-distribution/risk-distribution.component';
import { TopRiskClaimsComponent } from '../../components/top-risk-claims/top-risk-claims.component';
import { ProvidersRankingComponent } from '../../components/providers-ranking/providers-ranking.component';
import { CitiesAlertsComponent } from '../../components/cities-alerts/cities-alerts.component';
import { DashboardSummary, RiskDistributionItem, TopRiskClaim, ProviderRankingItem, CityAlert } from '../../../../core/models/dashboard.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    SummaryCardsComponent,
    RiskDistributionComponent,
    TopRiskClaimsComponent,
    ProvidersRankingComponent,
    CitiesAlertsComponent,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard de Riesgo</h1>
        <p class="text-slate-600">Resumen ejecutivo de siniestros y alertas generadas</p>
      </div>

      <!-- Summary Cards -->
      <div *ngIf="!loading() && summary()">
        <app-summary-cards [summary]="summary()!"></app-summary-cards>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()">
        <app-loading-spinner message="Cargando datos del dashboard..."></app-loading-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && !summary()">
        <app-empty-state
          icon="📊"
          title="Sin datos disponibles"
          message="Carga un dataset para comenzar el análisis."
        ></app-empty-state>
      </div>

      <!-- Risk Distribution & Top Claims -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" *ngIf="!loading() && summary()">
        <app-risk-distribution [items]="riskDistribution()"></app-risk-distribution>
        <div class="lg:col-span-2">
          <app-top-risk-claims [items]="topRiskClaims()"></app-top-risk-claims>
        </div>
      </div>

      <!-- Providers & Cities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" *ngIf="!loading() && summary()">
        <app-providers-ranking [items]="providersRanking()"></app-providers-ranking>
        <app-cities-alerts [items]="citiesAlerts()"></app-cities-alerts>
      </div>
    </div>
  `,
})
export class DashboardPageComponent implements OnInit {
  loading = signal(false);
  summary = signal<DashboardSummary | null>(null);
  riskDistribution = signal<RiskDistributionItem[]>([]);
  topRiskClaims = signal<TopRiskClaim[]>([]);
  providersRanking = signal<ProviderRankingItem[]>([]);
  citiesAlerts = signal<CityAlert[]>([]);

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loadRiskDistribution();
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error('No se pudo cargar el resumen del dashboard');
      },
    });
  }

  loadRiskDistribution(): void {
    this.dashboardService.getRiskDistribution().subscribe({
      next: (data) => {
        this.riskDistribution.set(data.items);
        this.loadTopRiskClaims();
      },
      error: () => {
        this.loadTopRiskClaims();
      },
    });
  }

  loadTopRiskClaims(): void {
    this.dashboardService.getTopRiskClaims(10).subscribe({
      next: (data) => {
        this.topRiskClaims.set(data.items);
        this.loadProvidersRanking();
      },
      error: () => {
        this.loadProvidersRanking();
      },
    });
  }

  loadProvidersRanking(): void {
    this.dashboardService.getProvidersRanking().subscribe({
      next: (data) => {
        this.providersRanking.set(data.items);
        this.loadCitiesAlerts();
      },
      error: () => {
        this.loadCitiesAlerts();
      },
    });
  }

  loadCitiesAlerts(): void {
    this.dashboardService.getCitiesAlerts().subscribe({
      next: (data) => {
        this.citiesAlerts.set(data.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
