import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RiskLevel } from '../../../../core/models/common.model';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { ClaimFilters } from '../../models/claim.model';

@Component({
  selector: 'app-claims-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent],
  template: `
    <form class="filters-panel" [formGroup]="form" (ngSubmit)="applyFilters()">
      <label class="field">
        <span>Nivel de riesgo</span>
        <select formControlName="riskLevel">
          <option value="">Todos</option>
          <option value="verde">Verde</option>
          <option value="amarillo">Amarillo</option>
          <option value="rojo">Rojo</option>
        </select>
      </label>
      <label class="field">
        <span>Ramo</span>
        <input type="text" formControlName="branch" placeholder="Vehículos" />
      </label>
      <label class="field">
        <span>Ciudad</span>
        <input type="text" formControlName="city" placeholder="Guayaquil" />
      </label>
      <label class="field">
        <span>Proveedor</span>
        <input type="text" formControlName="provider" placeholder="ID o nombre" />
      </label>
      <label class="field">
        <span>Desde</span>
        <input type="date" formControlName="dateFrom" />
      </label>
      <label class="field">
        <span>Hasta</span>
        <input type="date" formControlName="dateTo" />
      </label>
      <label class="field">
        <span>Ordenar por score</span>
        <select formControlName="sortDirection">
          <option value="desc">Mayor a menor</option>
          <option value="asc">Menor a mayor</option>
        </select>
      </label>
      <div class="filters-panel__actions">
        <app-button label="Filtrar" type="submit"></app-button>
        <app-button label="Limpiar" variant="ghost" type="button" (pressed)="clearFilters()"></app-button>
      </div>
    </form>
  `,
})
export class ClaimsFiltersComponent {
  @Output() filtersChanged = new EventEmitter<Partial<ClaimFilters>>();

  form = this.formBuilder.nonNullable.group({
    riskLevel: [''],
    branch: [''],
    city: [''],
    provider: [''],
    dateFrom: [''],
    dateTo: [''],
    sortDirection: ['desc'],
  });

  constructor(private formBuilder: FormBuilder) {}

  applyFilters(): void {
    const value = this.form.getRawValue();
    this.filtersChanged.emit({
      riskLevel: value.riskLevel as RiskLevel | '',
      branch: value.branch,
      city: value.city,
      provider: value.provider,
      dateFrom: value.dateFrom,
      dateTo: value.dateTo,
      sortDirection: value.sortDirection as 'asc' | 'desc',
    });
  }

  clearFilters(): void {
    this.form.reset({
      riskLevel: '',
      branch: '',
      city: '',
      provider: '',
      dateFrom: '',
      dateTo: '',
      sortDirection: 'desc',
    });
    this.applyFilters();
  }
}
