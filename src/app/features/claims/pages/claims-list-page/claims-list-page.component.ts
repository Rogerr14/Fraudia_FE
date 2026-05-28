import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { RiskBadgeComponent } from '../../../../shared/components/risk-badge/risk-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ClaimsService } from '../../services/claims.service';
import { Claim, PaginatedResponse } from '../../../../core/models/claim.model';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-claims-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppCardComponent,
    AppButtonComponent,
    RiskBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Siniestros</h1>
          <p class="text-slate-600">Gestiona y revisa los siniestros cargados</p>
        </div>
      </div>

      <!-- Filters -->
      <app-card title="Filtros">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nivel de Riesgo</label>
            <select
              [(ngModel)]="filterRiskLevel"
              (change)="onFilterChange()"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="Verde">Verde</option>
              <option value="Amarillo">Amarillo</option>
              <option value="Rojo">Rojo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Ramo</label>
            <input
              type="text"
              [(ngModel)]="filterRamo"
              (change)="onFilterChange()"
              placeholder="Ej: Vehiculos"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
            <input
              type="text"
              [(ngModel)]="filterCity"
              (change)="onFilterChange()"
              placeholder="Ej: Guayaquil"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Página</label>
            <input
              type="number"
              [(ngModel)]="currentPage"
              (change)="onPageChange()"
              [min]="1"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Por página</label>
            <select
              [(ngModel)]="pageSize"
              (change)="onPageChange()"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option [value]="10">10</option>
              <option [value]="20">20</option>
              <option [value]="50">50</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Loading -->
      <div *ngIf="loading()">
        <app-loading-spinner message="Cargando siniestros..."></app-loading-spinner>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && claims().length === 0">
        <app-empty-state
          icon="📋"
          title="Sin siniestros"
          message="No hay siniestros que coincidan con los filtros aplicados."
        ></app-empty-state>
      </div>

      <!-- Claims List -->
      <div *ngIf="!loading() && claims().length > 0" class="space-y-4">
        <div
          *ngFor="let claim of claims()"
          class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between gap-4 flex-wrap mb-3">
            <div>
              <p class="font-bold text-lg text-slate-900">{{ claim.id_siniestro }}</p>
              <p class="text-sm text-slate-600">{{ claim.ramo }} - {{ claim.cobertura }}</p>
            </div>
            <app-risk-badge [level]="claim.score.nivel_riesgo"></app-risk-badge>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <p class="text-slate-600">Fecha Ocurrencia</p>
              <p class="font-medium text-slate-900">{{ claim.fecha_ocurrencia | dateFormat: 'short' }}</p>
            </div>
            <div>
              <p class="text-slate-600">Score</p>
              <p class="font-medium text-slate-900">{{ claim.score.score_final }}</p>
            </div>
            <div>
              <p class="text-slate-600">Monto Reclamado</p>
              <p class="font-medium text-slate-900">{{ claim.monto_reclamado | currencyFormat }}</p>
            </div>
            <div>
              <p class="text-slate-600">Estado</p>
              <p class="font-medium text-slate-900">{{ claim.estado }}</p>
            </div>
          </div>

          <div class="flex gap-2">
            <a
              [routerLink]="[APP_ROUTES.claimDetail(claim.id_siniestro)]"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Detalle
            </a>
            <button
              (click)="onEvaluateClaim(claim.id_siniestro)"
              class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Evaluar
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6 text-sm text-slate-600">
          <p>
            Página {{ currentPage }} de {{ totalPages() }} | Total: {{ totalItems() }} siniestros
          </p>
          <div class="flex gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              ← Anterior
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages()"
              class="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ClaimsListPageComponent implements OnInit {
  loading = signal(false);
  claims = signal<Claim[]>([]);
  currentPage = 1;
  pageSize = 20;
  totalItems = signal(0);
  totalPages = signal(0);

  filterRiskLevel = '';
  filterRamo = '';
  filterCity = '';

  APP_ROUTES = APP_ROUTES;

  constructor(
    private claimsService: ClaimsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loading.set(true);

    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    if (this.filterRiskLevel) params.nivel_riesgo = this.filterRiskLevel;
    if (this.filterRamo) params.ramo = this.filterRamo;
    if (this.filterCity) params.ciudad = this.filterCity;

    this.claimsService.listClaims(params).subscribe({
      next: (response) => {
        this.claims.set(response.items);
        this.totalItems.set(response.total);
        this.totalPages.set(Math.ceil(response.total / response.limit));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar los siniestros');
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadClaims();
  }

  onPageChange(): void {
    this.loadClaims();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadClaims();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClaims();
    }
  }

  onEvaluateClaim(claimId: string): void {
    this.claimsService.evaluateClaim(claimId).subscribe({
      next: () => {
        this.notificationService.success('Siniestro evaluado correctamente');
        this.loadClaims();
      },
      error: () => {
        this.notificationService.error('Error al evaluar el siniestro');
      },
    });
  }
}
