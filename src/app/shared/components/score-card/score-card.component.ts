import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskBadgeComponent } from '../risk-badge/risk-badge.component';

@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [CommonModule, RiskBadgeComponent],
  template: `
    <div class="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-slate-600">Puntuación de Riesgo</h3>
          <app-risk-badge [level]="riskLevel"></app-risk-badge>
        </div>

        <div class="text-3xl font-bold text-slate-900">{{ finalScore }}</div>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div>
            <p class="text-xs text-slate-600 mb-1">Reglas</p>
            <p class="text-lg font-semibold text-slate-900">{{ rulesScore }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-600 mb-1">IA</p>
            <p class="text-lg font-semibold text-slate-900">{{ aiScore }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-600 mb-1">NLP</p>
            <p class="text-lg font-semibold text-slate-900">{{ nlpScore }}</p>
          </div>
        </div>

        <div *ngIf="recommendation" class="pt-4 border-t border-slate-200">
          <p class="text-xs font-medium text-slate-600 mb-2">Recomendación:</p>
          <p class="text-sm text-slate-700">{{ recommendation }}</p>
        </div>
      </div>
    </div>
  `,
})
export class ScoreCardComponent {
  @Input() finalScore: number = 0;
  @Input() rulesScore: number = 0;
  @Input() aiScore: number = 0;
  @Input() nlpScore: number = 0;
  @Input() riskLevel: 'Verde' | 'Amarillo' | 'Rojo' = 'Verde';
  @Input() recommendation: string = '';
}
