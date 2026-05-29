import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { AgentQueryResponse } from '../../../agent/models/agent.model';
import { AgentService } from '../../../agent/services/agent.service';
import { ClaimDetail } from '../../models/claim.model';
import { ReviewHistoryItem, ReviewRequest } from '../../models/review.model';
import { ClaimsService } from '../../services/claims.service';
import { ClaimAlertsListComponent } from '../../components/claim-alerts-list/claim-alerts-list.component';
import { ClaimDocumentsComponent } from '../../components/claim-documents/claim-documents.component';
import { ClaimHeaderComponent } from '../../components/claim-header/claim-header.component';
import { ClaimPolicyInfoComponent } from '../../components/claim-policy-info/claim-policy-info.component';
import { ClaimProviderInfoComponent } from '../../components/claim-provider-info/claim-provider-info.component';
import { ClaimReviewFormComponent } from '../../components/claim-review-form/claim-review-form.component';
import { ClaimScoreSummaryComponent } from '../../components/claim-score-summary/claim-score-summary.component';

@Component({
  selector: 'app-claim-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
    ClaimAlertsListComponent,
    ClaimDocumentsComponent,
    ClaimHeaderComponent,
    ClaimPolicyInfoComponent,
    ClaimProviderInfoComponent,
    ClaimReviewFormComponent,
    ClaimScoreSummaryComponent,
  ],
  template: `
    <section class="page">
      <app-loading-spinner *ngIf="loading()" message="Cargando detalle del siniestro"></app-loading-spinner>

      <ng-container *ngIf="!loading() && claim() as claimDetail">
        <app-claim-header
          [claim]="claimDetail"
          [evaluating]="evaluating()"
          [askingAgent]="askingAgent()"
          (evaluate)="evaluateClaim(claimDetail.id)"
          (askAgent)="askAgent(claimDetail.id)"
        ></app-claim-header>

        <div class="detail-grid">
          <app-claim-score-summary [claim]="claimDetail"></app-claim-score-summary>

          <app-card title="Datos generales" eyebrow="Registro del caso">
            <div class="info-grid">
              <div><span>Identificador</span><strong>{{ claimDetail.code }}</strong></div>
              <div><span>Estado</span><strong>{{ claimDetail.status || '-' }}</strong></div>
              <div><span>Fecha de ocurrencia</span><strong>{{ claimDetail.occurrenceDate | dateFormat }}</strong></div>
              <div><span>Fecha de reporte</span><strong>{{ claimDetail.reportedDate | dateFormat }}</strong></div>
              <div><span>Ciudad</span><strong>{{ claimDetail.city || '-' }}</strong></div>
              <div><span>Sucursal</span><strong>{{ claimDetail.office || '-' }}</strong></div>
              <div><span>Monto reclamado</span><strong>{{ claimDetail.claimedAmount | currencyFormat }}</strong></div>
              <div><span>Monto estimado</span><strong>{{ claimDetail.estimatedAmount | currencyFormat }}</strong></div>
              <div><span>Monto pagado</span><strong>{{ claimDetail.paidAmount | currencyFormat }}</strong></div>
              <div><span>Documentos completos</span><strong>{{ claimDetail.documentsComplete ? 'Sí' : 'No' }}</strong></div>
              <div><span>Restricción proveedor</span><strong>{{ claimDetail.providerListRestrictive ? 'Sí' : 'No' }}</strong></div>
              <div><span>Historial del asegurado</span><strong>{{ claimDetail.insuredClaimHistory }}</strong></div>
            </div>
          </app-card>
        </div>

        <app-card title="Explicación y recomendación" eyebrow="Lectura del score">
          <p class="body-text">{{ claimDetail.score.explanation }}</p>
          <p class="body-text"><strong>Recomendación:</strong> {{ claimDetail.score.recommendation }}</p>
          <p class="body-text"><strong>Descargo ético:</strong> {{ claimDetail.score.ethicalDisclaimer }}</p>
        </app-card>

        <app-card *ngIf="agentExplanation()" title="Explicación complementaria de IA" eyebrow="Asistente analítico">
          <p class="body-text">{{ agentExplanation()?.answer }}</p>
          <p class="body-text" *ngIf="agentExplanation()?.sources?.length">
            <strong>Fuentes:</strong> {{ agentExplanation()?.sources?.join(', ') }}
          </p>
          <p class="body-text"><strong>Nota:</strong> {{ agentExplanation()?.disclaimer }}</p>
        </app-card>

        <div class="detail-grid detail-grid--two">
          <app-claim-policy-info [claim]="claimDetail"></app-claim-policy-info>
          <app-claim-provider-info [provider]="claimDetail.provider"></app-claim-provider-info>
        </div>

        <app-card title="Resumen de revisión" eyebrow="Estado humano">
          <div class="info-grid">
            <div><span>Última decisión</span><strong>{{ claimDetail.reviewSummary.latestDecision || '-' }}</strong></div>
            <div><span>Última revisión</span><strong>{{ claimDetail.reviewSummary.latestReviewedAt | dateFormat: 'long' }}</strong></div>
            <div><span>Estado actual</span><strong>{{ claimDetail.reviewSummary.currentStatus || claimDetail.flowStatus || '-' }}</strong></div>
            <div><span>Total de revisiones</span><strong>{{ claimDetail.reviewSummary.totalReviews }}</strong></div>
          </div>
        </app-card>

        <app-claim-alerts-list [alerts]="claimDetail.alerts"></app-claim-alerts-list>
        <app-claim-documents [documents]="claimDetail.documents"></app-claim-documents>

        <app-card title="Historial de revisión" eyebrow="Trazabilidad humana">
          <div class="review-history" *ngIf="reviewHistory().length > 0; else noReviews">
            <article *ngFor="let review of reviewHistory()">
              <strong>{{ getDecisionLabel(review.decision) }}</strong>
              <span>{{ review.createdAt | dateFormat: 'long' }} · {{ review.reviewerName || 'Revisión humana' }}</span>
              <p>{{ review.comentario || 'Sin comentario.' }}</p>
              <small>{{ review.estadoResultante }}</small>
            </article>
          </div>
          <ng-template #noReviews>
            <p class="muted-text">Sin revisiones registradas.</p>
          </ng-template>
        </app-card>

        <app-claim-review-form (reviewSubmitted)="submitReview(claimDetail.id, $event)"></app-claim-review-form>
      </ng-container>

      <app-empty-state
        *ngIf="!loading() && !claim()"
        title="No hay información disponible"
        message="No se encontró el siniestro solicitado."
      ></app-empty-state>
    </section>
  `,
})
export class ClaimDetailPageComponent implements OnInit {
  loading = signal(true);
  evaluating = signal(false);
  askingAgent = signal(false);
  claim = signal<ClaimDetail | null>(null);
  reviewHistory = signal<ReviewHistoryItem[]>([]);
  agentExplanation = signal<AgentQueryResponse | null>(null);

  constructor(
    private route: ActivatedRoute,
    private claimsService: ClaimsService,
    private agentService: AgentService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (!claimId) {
      this.loading.set(false);
      return;
    }

    this.loadClaim(claimId);
  }

  evaluateClaim(claimId: string): void {
    this.evaluating.set(true);
    this.claimsService.evaluateClaim(claimId).subscribe({
      next: () => {
        this.notificationService.success('Evaluación actualizada correctamente.');
        this.evaluating.set(false);
        this.loadClaim(claimId);
      },
      error: () => this.evaluating.set(false),
    });
  }

  askAgent(claimId: string): void {
    this.askingAgent.set(true);
    this.agentService.explainClaim(claimId).subscribe({
      next: (response) => {
        this.agentExplanation.set(response);
        this.askingAgent.set(false);
      },
      error: () => this.askingAgent.set(false),
    });
  }

  submitReview(claimId: string, review: ReviewRequest): void {
    this.claimsService.submitReview(claimId, review).subscribe({
      next: () => {
        this.notificationService.success('Revisión registrada correctamente.');
        this.loadClaim(claimId);
      },
    });
  }

  getDecisionLabel(decision: string): string {
    const labels: Record<string, string> = {
      APPROVE: 'Aprobar',
      REJECT: 'Rechazar',
      ESCALATE_ANTIFRAUD: 'Escalar a antifraude',
      REQUEST_DOCUMENTS: 'Solicitar documentos',
      KEEP_IN_REVIEW: 'Mantener en revisión',
    };

    return labels[decision] ?? decision;
  }

  private loadClaim(claimId: string): void {
    this.loading.set(true);

    forkJoin({
      detail: this.claimsService.getClaimDetail(claimId),
      assessment: this.claimsService.getClaimAssessment(claimId),
      alerts: this.claimsService.getClaimAlerts(claimId),
      history: this.claimsService.getReviewHistory(claimId),
    }).subscribe({
      next: ({ detail, assessment, alerts, history }) => {
        this.claim.set({
          ...detail,
          score: {
            ...assessment,
            alerts: alerts.length > 0 ? alerts : assessment.alerts,
          },
          alerts,
        });
        this.reviewHistory.set(history);
        this.loading.set(false);
      },
      error: () => {
        this.claim.set(null);
        this.reviewHistory.set([]);
        this.loading.set(false);
      },
    });
  }
}
