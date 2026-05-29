import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import {
  AlertRankingItem,
  BranchRiskItem,
  CityAlertItem,
  DashboardSummary,
  ProviderRankingItem,
  ReviewStatusItem,
  RiskDistributionItem,
  TopRiskClaim,
} from '../../models/dashboard.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ProvidersRankingComponent } from '../../components/providers-ranking/providers-ranking.component';
import { CitiesAlertsComponent } from '../../components/cities-alerts/cities-alerts.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyFormatPipe, EmptyStateComponent, ProvidersRankingComponent, CitiesAlertsComponent],
  template: `
    <section class="dash-page">
      <ng-container *ngIf="summary() as summary">
        <div class="dash-hero">
          <div>
            <h1 class="dash-hero__title">Detector de Fraudes en Siniestros</h1>
            <p class="dash-hero__sub">Análisis inteligente · {{ summary.totalClaims }} casos cargados · {{ currentMonth }}</p>
          </div>
          <div class="dash-hero__actions">
            <button class="dash-btn dash-btn--csv" [routerLink]="APP_ROUTES.reports">Resumen ejecutivo</button>
            <button class="dash-btn dash-btn--pdf" [routerLink]="APP_ROUTES.uploads">Cargar dataset</button>
          </div>
        </div>

        <app-empty-state
          *ngIf="!hasAnyDashboardData()"
          title="Carga un dataset para iniciar el análisis"
          message="Todavía no existen siniestros evaluados en Fraudia."
          actionLabel="Cargar dataset"
          (action)="goToUploads()"
        ></app-empty-state>

        <ng-container *ngIf="hasAnyDashboardData()">
          <div class="dash-metrics">
            <div class="dash-metric">
              <div class="dash-metric__icon dash-metric__icon--red"></div>
              <strong>{{ summary.redClaims }}</strong>
              <p>Casos alto riesgo</p>
              <small>{{ summary.yellowClaims }} de riesgo medio</small>
            </div>

            <div class="dash-metric">
              <div class="dash-metric__icon dash-metric__icon--blue"></div>
              <strong>{{ summary.totalClaims }}</strong>
              <p>Casos en bandeja</p>
              <small>{{ summary.pendingClaims }} pendientes</small>
            </div>

            <div class="dash-metric">
              <div class="dash-metric__icon dash-metric__icon--orange"></div>
              <strong>{{ totalAmountFormatted }}</strong>
              <p>Exposición total</p>
              <small>monto bajo análisis</small>
            </div>

            <div class="dash-metric">
              <div class="dash-metric__icon dash-metric__icon--purple"></div>
              <strong>{{ summary.averageScore }}/100</strong>
              <p>Score promedio</p>
              <small>alerta para revisión humana</small>
            </div>
          </div>

          <div class="dash-tabs">
            <button class="dash-tab" [class.is-active]="activeTab() === 'bandeja'" (click)="switchTab('bandeja')">
              Bandeja de casos sospechosos
            </button>
            <button class="dash-tab" [class.is-active]="activeTab() === 'analisis'" (click)="switchTab('analisis')">
              Análisis &amp; gráficas
            </button>
          </div>

          <div *ngIf="activeTab() === 'bandeja'">
            <div class="dash-toolbar">
              <label class="dash-search">
                <input type="text" placeholder="Buscar por código, ramo o cobertura..." (input)="setSearch($event)" />
              </label>
              <div class="dash-chips">
                <button class="dash-chip" [class.is-active]="riskFilter() === ''" (click)="riskFilter.set('')">Todos</button>
                <button class="dash-chip dash-chip--red" [class.is-active]="riskFilter() === 'rojo'" (click)="riskFilter.set('rojo')">Alto riesgo</button>
                <button class="dash-chip dash-chip--yellow" [class.is-active]="riskFilter() === 'amarillo'" (click)="riskFilter.set('amarillo')">Riesgo medio</button>
                <button class="dash-chip dash-chip--green" [class.is-active]="riskFilter() === 'verde'" (click)="riskFilter.set('verde')">Bajo riesgo</button>
              </div>
              <div class="dash-toolbar__right">
                <span class="dash-count">{{ filteredClaims().length }} casos</span>
              </div>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>Código / Ramo</th>
                    <th>Cobertura</th>
                    <th>Monto</th>
                    <th>Score</th>
                    <th>Riesgo</th>
                    <th>Alertas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let claim of filteredClaims()">
                    <td>
                      <strong>{{ claim.code }}</strong>
                      <span>{{ claim.branch }}</span>
                    </td>
                    <td class="dash-td--muted">{{ claim.coverage }}</td>
                    <td class="dash-td--amount">{{ claim.claimedAmount | currencyFormat }}</td>
                    <td><strong>{{ claim.finalScore }}</strong></td>
                    <td>
                      <span class="dash-risk-badge" [class]="'dash-risk-badge--' + claim.riskLevel">
                        ● {{ riskLabel(claim.riskLevel) }}
                      </span>
                    </td>
                    <td>{{ claim.totalAlerts }}</td>
                    <td>
                      <a [routerLink]="APP_ROUTES.claimDetail(claim.id)" class="dash-action-btn" title="Ver detalle">Ver</a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p class="dash-empty" *ngIf="filteredClaims().length === 0">No hay casos que coincidan con los filtros aplicados.</p>
            </div>
          </div>

          <ng-container *ngIf="activeTab() === 'analisis'">
            <div class="dash-charts-row">
              <div class="dash-chart-card">
                <h3>Casos por ramo</h3>
                <p>Distribución por línea de seguro</p>
                <div class="branch-bars" *ngIf="branches().length > 0; else noBranch">
                  <div *ngFor="let branch of branches()" class="branch-bar-item">
                    <span class="branch-bar-label">{{ branch.branch }}</span>
                    <div class="branch-bar-track">
                      <div class="branch-bar-fill" [style.width.%]="(branch.totalClaims / maxBranchClaims()) * 100"></div>
                    </div>
                    <span class="branch-bar-count">{{ branch.totalClaims }}</span>
                  </div>
                </div>
                <ng-template #noBranch>
                  <p class="dash-no-data">No hay datos de ramo disponibles.</p>
                </ng-template>
              </div>

              <div class="dash-chart-card">
                <h3>Distribución por nivel de riesgo</h3>
                <p>Señales agregadas de priorización</p>
                <div class="donut-wrap" *ngIf="riskDistribution().length > 0; else noDist">
                  <div class="donut" [style.background]="donutGradient()">
                    <div class="donut__hole"></div>
                  </div>
                  <div class="donut-legend">
                    <div *ngFor="let item of riskDistribution()" class="donut-legend__item">
                      <span class="donut-dot" [style.background]="donutColor(item.level)"></span>
                      <span class="donut-legend__label">{{ riskLabel(item.level) }}</span>
                      <span class="donut-legend__count">{{ item.count }}</span>
                    </div>
                  </div>
                </div>
                <ng-template #noDist>
                  <p class="dash-no-data">No hay distribución disponible.</p>
                </ng-template>
              </div>
            </div>

            <div class="dash-chart-card" *ngIf="alerts().length > 0">
              <h3>Indicadores más frecuentes</h3>
              <p>Alertas para apoyar la revisión humana</p>
              <div class="indicators-grid">
                <div *ngFor="let alert of alerts(); let i = index" class="indicator-row">
                  <span class="indicator-num">{{ i + 1 }}</span>
                  <div class="indicator-body">
                    <span class="indicator-title">{{ alert.title }}</span>
                    <div class="indicator-track">
                      <div class="indicator-fill" [style.width.%]="(alert.occurrences / maxOccurrences()) * 100"></div>
                    </div>
                  </div>
                  <span class="indicator-count">{{ alert.occurrences }} casos</span>
                </div>
              </div>
            </div>

            <div class="dash-charts-row">
              <app-providers-ranking [items]="providers()"></app-providers-ranking>
              <app-cities-alerts [items]="cities()"></app-cities-alerts>
            </div>

            <div class="dash-chart-card">
              <h3>Estados de revisión</h3>
              <p>Seguimiento del flujo operativo</p>
              <div class="branch-bars" *ngIf="reviewStatus().length > 0; else noReviewStatus">
                <div *ngFor="let item of reviewStatus()" class="branch-bar-item">
                  <span class="branch-bar-label">{{ flowLabel(item.status) }}</span>
                  <div class="branch-bar-track">
                    <div class="branch-bar-fill" [style.width.%]="(item.count / maxReviewCount()) * 100"></div>
                  </div>
                  <span class="branch-bar-count">{{ item.count }}</span>
                </div>
              </div>
              <ng-template #noReviewStatus>
                <p class="dash-no-data">No hay estados de revisión disponibles.</p>
              </ng-template>
            </div>
          </ng-container>
        </ng-container>
      </ng-container>
    </section>
  `,
})
export class DashboardPageComponent implements OnInit {
  private readonly emptySummary: DashboardSummary = {
    totalClaims: 0,
    assessedClaims: 0,
    pendingClaims: 0,
    greenClaims: 0,
    yellowClaims: 0,
    redClaims: 0,
    averageScore: 0,
    totalClaimedAmount: 0,
    highRiskAmount: 0,
  };

  activeTab = signal<'bandeja' | 'analisis'>('bandeja');
  searchQuery = signal('');
  riskFilter = signal('');

  summary = signal<DashboardSummary>(this.emptySummary);
  riskDistribution = signal<RiskDistributionItem[]>([]);
  topClaims = signal<TopRiskClaim[]>([]);
  providers = signal<ProviderRankingItem[]>([]);
  alerts = signal<AlertRankingItem[]>([]);
  reviewStatus = signal<ReviewStatusItem[]>([]);
  branches = signal<BranchRiskItem[]>([]);
  cities = signal<CityAlertItem[]>([]);

  readonly APP_ROUTES = APP_ROUTES;

  filteredClaims = computed(() => {
    let items = this.topClaims();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      items = items.filter(
        (claim) =>
          claim.code.toLowerCase().includes(query) ||
          claim.branch.toLowerCase().includes(query) ||
          claim.coverage.toLowerCase().includes(query),
      );
    }

    const risk = this.riskFilter();
    if (risk) {
      items = items.filter((claim) => claim.riskLevel === risk);
    }

    return items;
  });

  donutGradient = computed(() => {
    const distribution = this.riskDistribution();
    if (!distribution.length) {
      return 'conic-gradient(from -90deg, #cbd5e1 0% 100%)';
    }

    let percentage = 0;
    const segments = distribution.map((item) => {
      const start = percentage;
      percentage += item.percentage;
      return `${this.donutColor(item.level)} ${start.toFixed(1)}% ${percentage.toFixed(1)}%`;
    });

    return `conic-gradient(from -90deg, ${segments.join(', ')})`;
  });

  maxBranchClaims = computed(() => Math.max(...this.branches().map((item) => item.totalClaims), 1));
  maxOccurrences = computed(() => Math.max(...this.alerts().map((item) => item.occurrences), 1));
  maxReviewCount = computed(() => Math.max(...this.reviewStatus().map((item) => item.count), 1));
  hasAnyDashboardData = computed(
    () =>
      this.summary().totalClaims > 0 ||
      this.topClaims().length > 0 ||
      this.providers().length > 0 ||
      this.alerts().length > 0 ||
      this.branches().length > 0 ||
      this.cities().length > 0 ||
      this.reviewStatus().length > 0,
  );

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadTopClaims();
    this.loadProviders();
    this.loadAlerts();
    this.loadReviewStatus();
    this.loadBranches();
    this.loadCities();
  }

  switchTab(tab: 'bandeja' | 'analisis'): void {
    this.activeTab.set(tab);
  }

  setSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  riskLabel(level: string): string {
    const labels: Record<string, string> = {
      rojo: 'Alto riesgo',
      critico: 'Crítico',
      amarillo: 'Riesgo medio',
      verde: 'Bajo riesgo',
    };

    return labels[level] ?? level;
  }

  flowLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING_REVIEW: 'Pendiente de revisión',
      IN_REVIEW: 'En revisión',
      PENDING_DOCUMENTS: 'Pendiente de documentos',
      ESCALATED_ANTIFRAUD: 'Escalado a antifraude',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
      CLOSED: 'Cerrado',
    };

    return labels[status] ?? status;
  }

  donutColor(level: string): string {
    const colors: Record<string, string> = {
      rojo: '#e24b4a',
      critico: '#d85a30',
      amarillo: '#f59e0b',
      verde: '#1d9e75',
    };

    return colors[level] ?? '#6b7280';
  }

  get currentMonth(): string {
    return new Date().toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
  }

  get totalAmountFormatted(): string {
    const amount = this.summary().totalClaimedAmount;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
    return `$${amount}`;
  }

  goToUploads(): void {
    this.router.navigate([APP_ROUTES.uploads]);
  }

  private loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => this.summary.set(summary),
    });

    this.dashboardService.getRiskDistribution().subscribe({
      next: (items) => this.riskDistribution.set(items),
    });
  }

  private loadTopClaims(): void {
    this.dashboardService.getTopRiskClaims().subscribe({
      next: (items) => this.topClaims.set(items),
    });
  }

  private loadProviders(): void {
    this.dashboardService.getProvidersRanking().subscribe({
      next: (items) => this.providers.set(items),
    });
  }

  private loadAlerts(): void {
    this.dashboardService.getAlertRanking().subscribe({
      next: (items) => this.alerts.set(items),
    });
  }

  private loadReviewStatus(): void {
    this.dashboardService.getReviewStatus().subscribe({
      next: (items) => this.reviewStatus.set(items),
    });
  }

  private loadBranches(): void {
    this.dashboardService.getBranches().subscribe({
      next: (items) => this.branches.set(items),
    });
  }

  private loadCities(): void {
    this.dashboardService.getCities().subscribe({
      next: (items) => this.cities.set(items),
    });
  }
}
