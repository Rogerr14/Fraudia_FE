import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../shared/components/card/app-card.component';
import { RiskDistributionItem } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-risk-distribution',
  standalone: true,
  imports: [CommonModule, AppCardComponent],
  template: `
    <app-card title="Distribución de Riesgo">
      <div class="space-y-4">
        <div *ngFor="let item of items" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-slate-700">{{ item.nivel_riesgo }}</span>
            <span class="text-sm font-bold text-slate-900">{{ item.cantidad }} ({{ item.porcentaje }}%)</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
              class="h-2 rounded-full"
              [ngClass]="getRiskColorClass(item.nivel_riesgo)"
              [style.width.%]="item.porcentaje"
            ></div>
          </div>
        </div>
      </div>
    </app-card>
  `,
})
export class RiskDistributionComponent {
  @Input() items: RiskDistributionItem[] = [];

  getRiskColorClass(level: 'Verde' | 'Amarillo' | 'Rojo'): string {
    const colors = {
      Verde: 'bg-green-500',
      Amarillo: 'bg-amber-500',
      Rojo: 'bg-red-500',
    };
    return colors[level];
  }
}
