import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../shared/components/card/app-card.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DashboardSummary } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, AppCardComponent, CurrencyFormatPipe],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Total Siniestros</p>
          <p class="text-2xl font-bold text-slate-900">{{ summary.total_siniestros }}</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Evaluados</p>
          <p class="text-2xl font-bold text-slate-900">{{ summary.evaluados }}</p>
          <p class="text-xs text-slate-500">{{ getPendingPercentage() }}% pendientes</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Score Promedio</p>
          <p class="text-2xl font-bold text-slate-900">{{ summary.score_promedio | number: '1.1-1' }}</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Casos Rojos</p>
          <p class="text-2xl font-bold text-red-600">{{ summary.riesgo_rojo }}</p>
          <p class="text-xs text-slate-500">En riesgo alto</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Monto Total Reclamado</p>
          <p class="text-xl font-bold text-slate-900">{{ summary.monto_total_reclamado | currencyFormat }}</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Monto en Riesgo (Rojo)</p>
          <p class="text-xl font-bold text-red-600">{{ summary.monto_en_riesgo_rojo | currencyFormat }}</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Casos Verdes</p>
          <p class="text-2xl font-bold text-green-600">{{ summary.riesgo_verde }}</p>
        </div>
      </app-card>

      <app-card>
        <div class="space-y-2">
          <p class="text-sm text-slate-600">Casos Amarillos</p>
          <p class="text-2xl font-bold text-amber-600">{{ summary.riesgo_amarillo }}</p>
        </div>
      </app-card>
    </div>
  `,
})
export class SummaryCardsComponent {
  @Input() summary!: DashboardSummary;

  getPendingPercentage(): number {
    if (this.summary.total_siniestros === 0) return 0;
    return Math.round((this.summary.pendientes / this.summary.total_siniestros) * 100);
  }
}
