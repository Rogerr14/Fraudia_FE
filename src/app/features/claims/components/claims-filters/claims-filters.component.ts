import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ClaimFilters } from '../../models/claim.model';

type FilterKey =
  | 'riskLevel'
  | 'flowStatus'
  | 'branch'
  | 'coverage'
  | 'city'
  | 'providerId'
  | 'dateFrom'
  | 'dateTo';

@Component({
  selector: 'app-claims-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cf-header">
      <div class="cf-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <strong>Filtros</strong>
      </div>
      <span class="cf-count" *ngIf="total !== null">{{ total }} casos</span>
    </div>

    <div class="cf-grid" [formGroup]="form">
      <label class="cf-field">
        <span>Nivel de riesgo</span>
        <select formControlName="riskLevel">
          <option value="">Todos</option>
          <option value="verde">Bajo riesgo</option>
          <option value="amarillo">Riesgo medio</option>
          <option value="rojo">Alto riesgo</option>
        </select>
      </label>

      <label class="cf-field">
        <span>Estado de flujo</span>
        <select formControlName="flowStatus">
          <option value="">Todos</option>
          <option value="PENDING_REVIEW">Pendiente de revisión</option>
          <option value="IN_REVIEW">En revisión</option>
          <option value="PENDING_DOCUMENTS">Pendiente de documentos</option>
          <option value="ESCALATED_ANTIFRAUD">Escalado a antifraude</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
          <option value="CLOSED">Cerrado</option>
        </select>
      </label>

      <label class="cf-field">
        <span>Ramo</span>
        <input type="text" formControlName="branch" placeholder="Vehículos, vida..." />
      </label>

      <label class="cf-field">
        <span>Cobertura</span>
        <input type="text" formControlName="coverage" placeholder="Todo riesgo, daños..." />
      </label>

      <label class="cf-field">
        <span>Ciudad</span>
        <input type="text" formControlName="city" placeholder="Quito, Guayaquil..." />
      </label>

      <label class="cf-field">
        <span>Proveedor</span>
        <input type="text" formControlName="providerId" placeholder="ID de proveedor" />
      </label>

      <label class="cf-field">
        <span>Rango de fechas</span>
        <div class="cf-date-range">
          <input type="date" formControlName="dateFrom" />
          <input type="date" formControlName="dateTo" />
        </div>
      </label>

      <label class="cf-field">
        <span>Ordenar por</span>
        <div class="cf-date-range">
          <select formControlName="sortBy">
            <option value="occurrence_date">Fecha de ocurrencia</option>
            <option value="score_total">Score total</option>
            <option value="monto_reclamado">Monto reclamado</option>
          </select>
          <select formControlName="sortOrder">
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </label>
    </div>

    <div class="cf-active" *ngIf="activeFilters.length > 0">
      <span>Activos:</span>
      <button *ngFor="let filter of activeFilters" class="cf-tag" type="button" (click)="removeFilter(filter.key)">
        {{ filter.label }} <span aria-hidden="true">×</span>
      </button>
    </div>
  `,
})
export class ClaimsFiltersComponent implements OnInit, OnDestroy {
  @Input() total: number | null = null;
  @Output() filtersChanged = new EventEmitter<Partial<ClaimFilters>>();

  private destroy$ = new Subject<void>();

  form = this.fb.nonNullable.group({
    riskLevel: [''],
    flowStatus: [''],
    branch: [''],
    coverage: [''],
    city: [''],
    providerId: [''],
    dateFrom: [''],
    dateTo: [''],
    sortBy: ['occurrence_date'],
    sortOrder: ['desc'],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(350), takeUntil(this.destroy$)).subscribe(() => this.emit());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeFilters(): { key: FilterKey; label: string }[] {
    const value = this.form.getRawValue();
    const filters: { key: FilterKey; label: string }[] = [];

    if (value.riskLevel) filters.push({ key: 'riskLevel', label: this.riskLabel(value.riskLevel) });
    if (value.flowStatus) filters.push({ key: 'flowStatus', label: this.flowLabel(value.flowStatus) });
    if (value.branch) filters.push({ key: 'branch', label: value.branch });
    if (value.coverage) filters.push({ key: 'coverage', label: value.coverage });
    if (value.city) filters.push({ key: 'city', label: value.city });
    if (value.providerId) filters.push({ key: 'providerId', label: value.providerId });
    if (value.dateFrom) filters.push({ key: 'dateFrom', label: `Desde: ${value.dateFrom}` });
    if (value.dateTo) filters.push({ key: 'dateTo', label: `Hasta: ${value.dateTo}` });

    return filters;
  }

  removeFilter(key: FilterKey): void {
    this.form.patchValue({ [key]: '' });
  }

  private emit(): void {
    const value = this.form.getRawValue();

    this.filtersChanged.emit({
      riskLevel: value.riskLevel,
      flowStatus: value.flowStatus,
      branch: value.branch,
      coverage: value.coverage,
      city: value.city,
      providerId: value.providerId,
      dateFrom: value.dateFrom,
      dateTo: value.dateTo,
      sortBy: value.sortBy,
      sortOrder: value.sortOrder as 'asc' | 'desc',
    });
  }

  private riskLabel(level: string): string {
    const labels: Record<string, string> = {
      verde: 'Bajo riesgo',
      amarillo: 'Riesgo medio',
      rojo: 'Alto riesgo',
    };

    return labels[level] ?? level;
  }

  private flowLabel(status: string): string {
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
}
