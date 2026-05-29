import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaginatedResult } from '../../../../core/models/pagination.model';
import { Claim, ClaimFilters } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims.service';
import { ClaimsFiltersComponent } from '../../components/claims-filters/claims-filters.component';
import { ClaimsTableComponent } from '../../components/claims-table/claims-table.component';

@Component({
  selector: 'app-claims-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppButtonComponent,
    AppCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    ClaimsFiltersComponent,
    ClaimsTableComponent,
  ],
  template: `
    <section class="page">
      <app-loading-spinner *ngIf="loading()" message="Cargando bandeja de siniestros"></app-loading-spinner>

      <ng-container *ngIf="!loading() && result() as claimsResult">
        <header class="page-header">
          <div>
            <p class="page-kicker">Bandeja operativa</p>
            <h1>Siniestros</h1>
            <span>Filtra, prioriza y recalcula el riesgo de cada caso.</span>
          </div>
        </header>

        <div class="app-card">
          <app-claims-filters [total]="claimsResult.total" (filtersChanged)="onFiltersChanged($event)"></app-claims-filters>
        </div>

        <app-empty-state
          *ngIf="claimsResult.items.length === 0"
          title="Carga un dataset para iniciar el análisis"
          message="No hay siniestros disponibles todavía o no existen coincidencias con los filtros aplicados."
          actionLabel="Cargar dataset"
          (action)="goToUploads()"
        ></app-empty-state>

        <app-claims-table
          *ngIf="claimsResult.items.length > 0"
          [claims]="claimsResult.items"
          (evaluate)="evaluateClaim($event)"
          (explain)="explainClaim($event)"
        ></app-claims-table>

        <div class="pagination-bar" *ngIf="claimsResult.items.length > 0">
          <span>Página {{ claimsResult.page }} de {{ claimsResult.totalPages }} · {{ claimsResult.total }} siniestros</span>
          <label class="pagination-bar__limit">
            Mostrar
            <select [(ngModel)]="filters.limit" (ngModelChange)="onLimitChanged()">
              <option [value]="10">10</option>
              <option [value]="20">20</option>
              <option [value]="50">50</option>
            </select>
          </label>
          <div *ngIf="claimsResult.totalPages > 1">
            <app-button label="Anterior" variant="ghost" [disabled]="filters.page === 1" (pressed)="previousPage()"></app-button>
            <app-button
              label="Siguiente"
              variant="secondary"
              [disabled]="filters.page >= claimsResult.totalPages"
              (pressed)="nextPage()"
            ></app-button>
          </div>
        </div>
      </ng-container>
    </section>
  `,
})
export class ClaimsListPageComponent implements OnInit {
  loading = signal(true);
  result = signal<PaginatedResult<Claim> | null>(null);

  filters: ClaimFilters = {
    page: 1,
    limit: 20,
    sortBy: 'occurrence_date',
    sortOrder: 'desc',
  };

  constructor(
    private claimsService: ClaimsService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  onFiltersChanged(filters: Partial<ClaimFilters>): void {
    this.filters = {
      ...this.filters,
      ...filters,
      page: 1,
    };
    this.loadClaims();
  }

  onLimitChanged(): void {
    this.filters = { ...this.filters, page: 1 };
    this.loadClaims();
  }

  nextPage(): void {
    this.filters = { ...this.filters, page: this.filters.page + 1 };
    this.loadClaims();
  }

  previousPage(): void {
    this.filters = { ...this.filters, page: Math.max(1, this.filters.page - 1) };
    this.loadClaims();
  }

  evaluateClaim(claimId: string): void {
    this.claimsService.evaluateClaim(claimId).subscribe({
      next: () => {
        this.notificationService.success('Siniestro recalculado correctamente.');
        this.loadClaims();
      },
    });
  }

  explainClaim(claimId: string): void {
    this.router.navigate([APP_ROUTES.agent], {
      queryParams: {
        claim_id: claimId,
        auto_explain: 'true',
      },
    });
  }

  goToUploads(): void {
    this.router.navigate([APP_ROUTES.uploads]);
  }

  private loadClaims(): void {
    this.loading.set(true);
    this.claimsService.listClaims(this.filters).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.result.set(null);
        this.loading.set(false);
      },
    });
  }
}
