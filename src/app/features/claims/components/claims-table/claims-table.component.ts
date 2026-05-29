import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { FlowStatusBadgeComponent } from '../../../../shared/components/flow-status-badge/flow-status-badge.component';
import { RiskBadgeComponent } from '../../../../shared/components/risk-badge/risk-badge.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claims-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppButtonComponent,
    FlowStatusBadgeComponent,
    RiskBadgeComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="claims-desktop-table">
      <table>
        <thead>
          <tr>
            <th>Siniestro</th>
            <th>Ramo</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Score</th>
            <th>Riesgo</th>
            <th>Flujo</th>
            <th>Alertas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let claim of claims">
            <td>
              <strong>{{ claim.code }}</strong>
              <span>{{ claim.coverage || '-' }}</span>
            </td>
            <td>{{ claim.branch || '-' }}</td>
            <td>{{ claim.occurrenceDate | dateFormat }}</td>
            <td>{{ claim.claimedAmount | currencyFormat }}</td>
            <td><strong>{{ claim.score.finalScore }}</strong></td>
            <td><app-risk-badge [level]="claim.score.level"></app-risk-badge></td>
            <td><app-flow-status-badge [status]="claim.flowStatus"></app-flow-status-badge></td>
            <td>{{ claim.totalAlerts }}</td>
            <td>
              <div class="table-actions">
                <a [routerLink]="APP_ROUTES.claimDetail(claim.id)">Ver detalle</a>
                <button type="button" (click)="evaluate.emit(claim.id)">Recalcular</button>
                <button type="button" (click)="explain.emit(claim.id)">Explicar IA</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="claims-mobile-list">
      <article *ngFor="let claim of claims" class="claim-card">
        <div class="claim-card__header">
          <div>
            <strong>{{ claim.code }}</strong>
            <span>{{ claim.branch || 'Sin ramo' }} · {{ claim.coverage || 'Sin cobertura' }}</span>
          </div>
          <app-risk-badge [level]="claim.score.level"></app-risk-badge>
        </div>

        <div class="claim-card__metrics">
          <div><span>Score</span><strong>{{ claim.score.finalScore }}</strong></div>
          <div><span>Flujo</span><app-flow-status-badge [status]="claim.flowStatus"></app-flow-status-badge></div>
          <div><span>Alertas</span><strong>{{ claim.totalAlerts }}</strong></div>
          <div><span>Monto</span><strong>{{ claim.claimedAmount | currencyFormat }}</strong></div>
          <div><span>Fecha</span><strong>{{ claim.occurrenceDate | dateFormat }}</strong></div>
        </div>

        <div class="actions-row">
          <a class="text-link" [routerLink]="APP_ROUTES.claimDetail(claim.id)">Ver detalle</a>
          <app-button label="Recalcular" size="sm" variant="secondary" (pressed)="evaluate.emit(claim.id)"></app-button>
          <app-button label="Explicar IA" size="sm" variant="ghost" (pressed)="explain.emit(claim.id)"></app-button>
        </div>
      </article>
    </div>
  `,
})
export class ClaimsTableComponent {
  @Input() claims: Claim[] = [];
  @Output() evaluate = new EventEmitter<string>();
  @Output() explain = new EventEmitter<string>();

  readonly APP_ROUTES = APP_ROUTES;
}
