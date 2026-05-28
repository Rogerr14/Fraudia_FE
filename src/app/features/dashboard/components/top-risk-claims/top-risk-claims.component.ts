import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppCardComponent } from '../../../shared/components/card/app-card.component';
import { RiskBadgeComponent } from '../../../shared/components/risk-badge/risk-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { TopRiskClaim } from '../../../core/models/dashboard.model';
import { APP_ROUTES } from '../../../core/constants/app-routes';

@Component({
  selector: 'app-top-risk-claims',
  standalone: true,
  imports: [CommonModule, RouterModule, AppCardComponent, RiskBadgeComponent, CurrencyFormatPipe],
  template: `
    <app-card title="Top 10 Siniestros Más Riesgosos">
      <div class="space-y-3">
        <div
          *ngFor="let claim of items"
          class="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <p class="font-semibold text-slate-900">{{ claim.id_siniestro }}</p>
              <p class="text-xs text-slate-600">{{ claim.ramo }} - {{ claim.cobertura }}</p>
            </div>
            <app-risk-badge [level]="claim.nivel_riesgo" [compact]="true"></app-risk-badge>
          </div>
          <div class="grid grid-cols-2 gap-2 mb-2 text-sm">
            <div>
              <p class="text-xs text-slate-600">Score Final</p>
              <p class="font-bold text-slate-900">{{ claim.score_final }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-600">Monto</p>
              <p class="font-bold text-slate-900">{{ claim.monto_reclamado | currencyFormat }}</p>
            </div>
          </div>
          <div *ngIf="claim.principales_alertas.length" class="mb-2">
            <p class="text-xs text-slate-600 mb-1">Alertas:</p>
            <div class="flex flex-wrap gap-1">
              <span
                *ngFor="let alert of claim.principales_alertas"
                class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
              >
                {{ alert }}
              </span>
            </div>
          </div>
          <a
            [routerLink]="[APP_ROUTES.claimDetail(claim.id_siniestro)]"
            class="inline-block text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver detalle →
          </a>
        </div>
      </div>
    </app-card>
  `,
})
export class TopRiskClaimsComponent {
  @Input() items: TopRiskClaim[] = [];
  APP_ROUTES = APP_ROUTES;
}
