import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppBadgeComponent } from '../../../../shared/components/badge/app-badge.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { RulesService } from '../../services/rules.service';
import { Rule } from '../../../../core/models/rule.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [CommonModule, AppCardComponent, AppBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Reglas de Evaluación</h1>
        <p class="text-slate-600">Reglas de puntuación configuradas en el sistema</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()">
        <app-loading-spinner message="Cargando reglas..."></app-loading-spinner>
      </div>

      <!-- Rules Grid -->
      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let rule of rules()"
          class="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Rule Header -->
          <div class="bg-gradient-to-r from-blue-50 to-slate-50 p-4 border-b border-slate-200">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <p class="font-mono text-xs text-blue-600 font-bold">{{ rule.codigo_regla }}</p>
                <h3 class="font-bold text-slate-900 text-sm">{{ rule.nombre }}</h3>
              </div>
              <app-badge
                [label]="rule.activa ? 'Activa' : 'Inactiva'"
                [variant]="rule.activa ? 'success' : 'warning'"
              ></app-badge>
            </div>
          </div>

          <!-- Rule Content -->
          <div class="p-4 space-y-3">
            <div class="text-sm">
              <p class="text-slate-600 mb-1">Categoría</p>
              <p class="font-medium text-slate-900">{{ rule.categoria }}</p>
            </div>

            <div class="text-sm">
              <p class="text-slate-600 mb-1">Tipo de Regla</p>
              <p class="font-medium text-slate-900">{{ rule.tipo_regla }}</p>
            </div>

            <div class="text-sm">
              <p class="text-slate-600 mb-1">Puntaje Máximo</p>
              <p class="font-bold text-amber-600">{{ rule.puntaje_maximo }} puntos</p>
            </div>

            <div class="text-sm">
              <p class="text-slate-600 mb-1">Descripción</p>
              <p class="text-slate-700">{{ rule.descripcion }}</p>
            </div>

            <!-- Conditions Section -->
            <div *ngIf="rule.condiciones && rule.condiciones.length > 0" class="mt-4 pt-4 border-t border-slate-200">
              <p class="text-xs font-bold text-slate-700 mb-2">CONDICIONES ({{ rule.condiciones.length }})</p>
              <div class="space-y-3">
                <div
                  *ngFor="let condition of rule.condiciones"
                  class="bg-slate-50 rounded p-3 border-l-2 border-blue-400"
                >
                  <p class="text-xs font-bold text-slate-900 mb-1">{{ condition.nombre_condicion }}</p>
                  <p class="text-xs text-slate-700 mb-2">{{ condition.descripcion_resultado }}</p>
                  <div class="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      <strong>Campo:</strong> {{ condition.campo_evaluado }} |
                      <strong>Operador:</strong> {{ condition.operador }}
                    </span>
                    <span class="font-bold text-amber-600">+{{ condition.puntaje }} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RulesPageComponent implements OnInit {
  loading = signal(false);
  rules = signal<Rule[]>([]);

  constructor(
    private rulesService: RulesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.loading.set(true);

    this.rulesService.listRules().subscribe({
      next: (response) => {
        // Load each rule with its details
        this.rules.set(response.items);
        
        // Load details for each rule to get conditions
        response.items.forEach((rule) => {
          this.rulesService.getRuleDetail(rule.id_regla).subscribe({
            next: (detail) => {
              const index = this.rules().findIndex((r) => r.id_regla === detail.id_regla);
              if (index >= 0) {
                const updated = [...this.rules()];
                updated[index] = detail;
                this.rules.set(updated);
              }
            },
          });
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar las reglas');
      },
    });
  }
}
