import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ClaimsService } from '../../../claims/services/claims.service';
import { DashboardViewModel } from '../../models/dashboard.model';
import { Claim } from '../../../claims/models/claim.model';
import { PaginatedResult } from '../../../../core/models/pagination.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { APP_ROUTES } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyFormatPipe],
  template: `
    <section class="dash-page">

      <!-- Loading -->
      <div *ngIf="loading()" class="dash-loading">
        <div class="dash-loading__ring"></div>
        <p>Cargando dashboard...</p>
      </div>

      <ng-container *ngIf="!loading() && view() as v">

        <!-- Hero -->
        <div class="dash-hero">
          <div>
            <h1 class="dash-hero__title">Detector de Fraudes en Siniestros</h1>
            <p class="dash-hero__sub">Análisis inteligente · {{ v.summary.totalClaims }} casos cargados · {{ currentMonth }}</p>
          </div>
          <div class="dash-hero__actions">
            <button class="dash-btn dash-btn--csv">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar CSV
            </button>
            <button class="dash-btn dash-btn--pdf">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Reporte PDF
            </button>
          </div>
        </div>

        <!-- 4 Metric cards -->
        <div class="dash-metrics">
          <div class="dash-metric">
            <div class="dash-metric__icon dash-metric__icon--red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span class="dash-metric__arrow">↗</span>
            <strong>{{ v.summary.redClaims }}</strong>
            <p>Casos alto riesgo</p>
            <small>{{ v.summary.yellowClaims }} de riesgo medio</small>
          </div>

          <div class="dash-metric">
            <div class="dash-metric__icon dash-metric__icon--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span class="dash-metric__arrow">↗</span>
            <strong>{{ v.summary.totalClaims }}</strong>
            <p>Casos en bandeja</p>
            <small>activos este mes</small>
          </div>

          <div class="dash-metric">
            <div class="dash-metric__icon dash-metric__icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span class="dash-metric__arrow">↗</span>
            <strong>{{ totalAmountFormatted }}</strong>
            <p>Exposición total</p>
            <small>monto bajo análisis</small>
          </div>

          <div class="dash-metric">
            <div class="dash-metric__icon dash-metric__icon--purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span class="dash-metric__arrow">↗</span>
            <strong>{{ v.summary.averageScore }}/100</strong>
            <p>Score promedio IA</p>
            <small>índice de riesgo</small>
          </div>
        </div>

        <!-- Tabs -->
        <div class="dash-tabs">
          <button class="dash-tab" [class.is-active]="activeTab() === 'bandeja'" (click)="switchTab('bandeja')">
            Bandeja de casos sospechosos
          </button>
          <button class="dash-tab" [class.is-active]="activeTab() === 'analisis'" (click)="switchTab('analisis')">
            Análisis &amp; Gráficas
          </button>
        </div>

        <!-- ── Tab: Bandeja ── -->
        <div *ngIf="activeTab() === 'bandeja'">
          <div class="dash-toolbar">
            <label class="dash-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Buscar por ID, ramo, cobertura..." (input)="setSearch($event)" />
            </label>
            <div class="dash-chips">
              <button class="dash-chip" [class.is-active]="riskFilter() === ''" (click)="applyRiskFilter('')">Todos</button>
              <button class="dash-chip dash-chip--red" [class.is-active]="riskFilter() === 'rojo'" (click)="applyRiskFilter('rojo')">Alto riesgo</button>
              <button class="dash-chip dash-chip--yellow" [class.is-active]="riskFilter() === 'amarillo'" (click)="applyRiskFilter('amarillo')">Medio riesgo</button>
              <button class="dash-chip dash-chip--green" [class.is-active]="riskFilter() === 'verde'" (click)="applyRiskFilter('verde')">Bajo riesgo</button>
            </div>
            <div class="dash-toolbar__right">
              <span class="dash-count">{{ bandejaResult()?.total ?? 0 }} casos</span>
              <label class="dash-limit-label">
                Mostrar
                <select [ngModel]="bandejaLimit()" (ngModelChange)="applyLimit($event)">
                  <option *ngFor="let n of limitOptions" [value]="n">{{ n }}</option>
                </select>
              </label>
            </div>
          </div>

          <div class="dash-table-wrap">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>ID / Ramo</th>
                  <th>Cobertura</th>
                  <th>Monto</th>
                  <th>Score IA ↓</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let claim of filteredClaims()">
                  <td>
                    <strong>{{ claim.id }}</strong>
                    <span>{{ claim.branch ?? '—' }}</span>
                  </td>
                  <td class="dash-td--muted">{{ claim.coverage ?? '—' }}</td>
                  <td class="dash-td--amount">{{ claim.claimedAmount | currencyFormat }}</td>
                  <td>
                    <div class="score-bar-wrap">
                      <div class="score-bar">
                        <div class="score-bar__fill"
                             [class]="'score-bar__fill--' + claim.score.level"
                             [style.width.%]="claim.score.finalScore">
                        </div>
                      </div>
                      <span [style.color]="scoreColor(claim.score.finalScore)" class="score-num">
                        {{ claim.score.finalScore }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="dash-risk-badge" [class]="'dash-risk-badge--' + claim.score.level">
                      ● {{ riskLabel(claim.score.level) }}
                    </span>
                  </td>
                  <td>
                    <a [routerLink]="APP_ROUTES.claimDetail(claim.id)" class="dash-action-btn" title="Ver detalle">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="dash-empty" *ngIf="filteredClaims().length === 0 && !bandejaLoading()">
              No hay casos que coincidan con los filtros aplicados.
            </p>
          </div>

          <!-- Paginación -->
          <div class="dash-pagination" *ngIf="bandejaResult() as r">
            <span class="dash-pagination__info">
              Página {{ bandejaPage() }} de {{ r.totalPages }} · {{ r.total }} casos
            </span>
            <div class="dash-pagination__btns" *ngIf="r.totalPages > 1">
              <button class="dash-btn dash-btn--sm" [disabled]="bandejaPage() === 1" (click)="prevBandejaPage()">
                ← Anterior
              </button>
              <button class="dash-btn dash-btn--sm" [disabled]="bandejaPage() >= r.totalPages" (click)="nextBandejaPage()">
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        <!-- ── Tab: Análisis ── -->
        <ng-container *ngIf="activeTab() === 'analisis'">
          <div class="dash-charts-row">

            <!-- Bar chart: ramo -->
            <div class="dash-chart-card">
              <h3>Casos por ramo</h3>
              <p>Distribución por línea de seguro</p>
              <div class="branch-bars" *ngIf="v.branchRisk.length > 0; else noBranch">
                <div *ngFor="let b of v.branchRisk" class="branch-bar-item">
                  <span class="branch-bar-label">{{ b.branch }}</span>
                  <div class="branch-bar-track">
                    <div class="branch-bar-fill" [style.width.%]="(b.totalClaims / maxBranchClaims()) * 100"></div>
                  </div>
                  <span class="branch-bar-count">{{ b.totalClaims }}</span>
                </div>
              </div>
              <ng-template #noBranch>
                <p class="dash-no-data">Sin datos de ramo disponibles.</p>
              </ng-template>
            </div>

            <!-- Donut chart: distribución por nivel -->
            <div class="dash-chart-card">
              <h3>Distribución por nivel de riesgo</h3>
              <p>Casos con riesgo alto o medio</p>
              <div class="donut-wrap" *ngIf="v.riskDistribution.length > 0; else noDist">
                <div class="donut" [style.background]="donutGradient()">
                  <div class="donut__hole"></div>
                </div>
                <div class="donut-legend">
                  <div *ngFor="let item of v.riskDistribution" class="donut-legend__item">
                    <span class="donut-dot" [style.background]="riskColor(item.level)"></span>
                    <span class="donut-legend__label">{{ riskLabel(item.level) }}</span>
                    <span class="donut-legend__count">{{ item.count }}</span>
                  </div>
                </div>
              </div>
              <ng-template #noDist>
                <p class="dash-no-data">Sin datos de distribución.</p>
              </ng-template>
            </div>

          </div>

          <!-- Alert indicators -->
          <div class="dash-chart-card" *ngIf="v.alertRanking.length > 0">
            <h3>Indicadores más frecuentes detectados por IA</h3>
            <p>Frecuencia de aparición en todos los casos del período</p>
            <div class="indicators-grid">
              <div *ngFor="let alert of v.alertRanking; let i = index" class="indicator-row">
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
        </ng-container>

      </ng-container>

      <!-- Empty state -->
      <div *ngIf="!loading() && !view()" class="dash-empty-state">
        <p>Carga un dataset para comenzar el análisis.</p>
      </div>

    </section>
  `,
})
export class DashboardPageComponent implements OnInit {
  loading = signal(true);
  view = signal<DashboardViewModel | null>(null);
  activeTab = signal<'bandeja' | 'analisis'>('bandeja');
  searchQuery = signal('');
  riskFilter = signal('');

  // Bandeja pagination
  bandejaResult = signal<PaginatedResult<Claim> | null>(null);
  bandejaLoading = signal(false);
  bandejaLimit = signal(20);
  bandejaPage = signal(1);

  // Analytics tab (lazy)
  analyticsLoaded = signal(false);
  analyticsLoading = signal(false);

  readonly APP_ROUTES = APP_ROUTES;
  readonly limitOptions = [20, 50, 100];

  filteredClaims = computed(() => {
    const items = this.bandejaResult()?.items ?? [];
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return items;
    return items.filter((c) => c.id.toLowerCase().includes(q) || (c.branch ?? '').toLowerCase().includes(q));
  });

  donutGradient = computed(() => {
    const dist = this.view()?.riskDistribution ?? [];
    if (!dist.length) return 'conic-gradient(from -90deg, #1e293b 0% 100%)';
    const colors: Record<string, string> = { rojo: '#ef4444', critico: '#dc2626', amarillo: '#f59e0b', verde: '#22c55e' };
    let pct = 0;
    const stops = dist.map((item) => {
      const c = colors[item.level] ?? '#6b7280';
      const s = pct;
      pct += item.percentage;
      return `${c} ${s.toFixed(1)}% ${pct.toFixed(1)}%`;
    });
    return `conic-gradient(from -90deg, ${stops.join(', ')})`;
  });

  maxOccurrences = computed(() => Math.max(...(this.view()?.alertRanking ?? []).map((a) => a.occurrences), 1));
  maxBranchClaims = computed(() => Math.max(...(this.view()?.branchRisk ?? []).map((b) => b.totalClaims), 1));

  get currentMonth(): string {
    return new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  }

  get totalAmountFormatted(): string {
    const amount = this.view()?.summary.totalClaimedAmount ?? 0;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
    if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
    return `$${amount}`;
  }

  constructor(
    private dashboardService: DashboardService,
    private claimsService: ClaimsService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardView().subscribe({
      next: (view) => { this.view.set(view); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.loadBandeja();
  }

  switchTab(tab: 'bandeja' | 'analisis'): void {
    this.activeTab.set(tab);
    if (tab === 'analisis' && !this.analyticsLoaded()) {
      this.analyticsLoading.set(true);
      this.dashboardService.getAnalyticsData().subscribe({
        next: (data) => {
          const v = this.view();
          if (v) this.view.set({ ...v, ...data });
          this.analyticsLoaded.set(true);
          this.analyticsLoading.set(false);
        },
        error: () => this.analyticsLoading.set(false),
      });
    }
  }

  applyRiskFilter(level: string): void {
    this.riskFilter.set(level);
    this.bandejaPage.set(1);
    this.loadBandeja();
  }

  applyLimit(limit: number): void {
    this.bandejaLimit.set(Number(limit));
    this.bandejaPage.set(1);
    this.loadBandeja();
  }

  nextBandejaPage(): void {
    this.bandejaPage.update((p) => p + 1);
    this.loadBandeja();
  }

  prevBandejaPage(): void {
    this.bandejaPage.update((p) => Math.max(1, p - 1));
    this.loadBandeja();
  }

  setSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }

  riskLabel(level: string): string {
    const map: Record<string, string> = { rojo: 'Alto riesgo', critico: 'Crítico', amarillo: 'Medio riesgo', verde: 'Bajo riesgo' };
    return map[level] ?? level;
  }

  riskColor(level: string): string {
    const map: Record<string, string> = { rojo: '#ef4444', critico: '#dc2626', amarillo: '#f59e0b', verde: '#22c55e' };
    return map[level] ?? '#6b7280';
  }

  scoreColor(score: number): string {
    if (score >= 75) return 'var(--color-red)';
    if (score >= 50) return 'var(--color-orange)';
    return 'var(--color-green)';
  }

  private loadBandeja(): void {
    this.bandejaLoading.set(true);
    this.claimsService
      .listClaimsPaginated(this.bandejaPage(), this.bandejaLimit(), this.riskFilter())
      .subscribe({
        next: (result) => { this.bandejaResult.set(result); this.bandejaLoading.set(false); },
        error: () => this.bandejaLoading.set(false),
      });
  }
}
