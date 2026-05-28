import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { RiskBadgeComponent } from '../../../../shared/components/risk-badge/risk-badge.component';
import { ScoreCardComponent } from '../../../../shared/components/score-card/score-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ClaimsService } from '../../services/claims.service';
import { AgentService } from '../../../agent/services/agent.service';
import { ClaimDetail, ReviewHistoryItem } from '../../../../core/models/claim.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReviewRequest } from '../../../../core/models/report.model';

@Component({
  selector: 'app-claim-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppCardComponent,
    AppButtonComponent,
    RiskBadgeComponent,
    ScoreCardComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div *ngIf="loading()" class="col-span-full">
        <app-loading-spinner message="Cargando detalle del siniestro..."></app-loading-spinner>
      </div>

      <div *ngIf="!loading() && claimDetail()">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ claimDetail()?.id_siniestro }}</h1>
            <p class="text-slate-600">{{ claimDetail()?.ramo }} - {{ claimDetail()?.cobertura }}</p>
          </div>
          <app-risk-badge [level]="claimDetail()?.score.nivel_riesgo!"></app-risk-badge>
        </div>

        <!-- Score Card -->
        <app-score-card
          [finalScore]="claimDetail()?.score.score_final || 0"
          [rulesScore]="claimDetail()?.score.score_reglas || 0"
          [aiScore]="claimDetail()?.score.score_modelo_ia || 0"
          [nlpScore]="claimDetail()?.score.score_nlp || 0"
          [riskLevel]="claimDetail()?.score.nivel_riesgo!"
          [recommendation]="claimDetail()?.score.recomendacion || ''"
        ></app-score-card>

        <!-- General Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-card title="Información General">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">Fecha Ocurrencia:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.fecha_ocurrencia | dateFormat }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Fecha Reporte:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.fecha_reporte | dateFormat }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Estado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.estado }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Sucursal:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.sucursal }}</dd>
              </div>
            </dl>
          </app-card>

          <app-card title="Montos">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">Monto Reclamado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.monto_reclamado | currencyFormat }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Monto Estimado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.monto_estimado | currencyFormat }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Monto Pagado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.monto_pagado | currencyFormat }}</dd>
              </div>
            </dl>
          </app-card>

          <!-- Policy Info -->
          <app-card title="Información de Póliza">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">ID Póliza:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.poliza.id_poliza }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Vigencia:</dt>
                <dd class="font-medium text-slate-900">
                  {{ claimDetail()?.poliza.fecha_inicio | dateFormat: 'short' }} -
                  {{ claimDetail()?.poliza.fecha_fin | dateFormat: 'short' }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Suma Asegurada:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.poliza.suma_asegurada | currencyFormat }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Estado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.poliza.estado_poliza }}</dd>
              </div>
            </dl>
          </app-card>

          <!-- Insured Info -->
          <app-card title="Información del Asegurado">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">ID Asegurado:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.asegurado.id_asegurado }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Segmento:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.asegurado.segmento }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Ciudad:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.asegurado.ciudad }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Reclamos últimos 12m:</dt>
                <dd class="font-medium text-red-600">{{ claimDetail()?.asegurado.reclamos_ultimos_12_meses }}</dd>
              </div>
            </dl>
          </app-card>

          <!-- Vehicle Info -->
          <app-card *ngIf="claimDetail()?.vehiculo" title="Información del Vehículo">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">ID:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.vehiculo.id_vehiculo }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Marca:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.vehiculo.marca }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Modelo:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.vehiculo.modelo }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Año:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.vehiculo.anio }}</dd>
              </div>
            </dl>
          </app-card>

          <!-- Provider Info -->
          <app-card title="Información del Proveedor">
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-600">ID Proveedor:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.proveedor.id_proveedor }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Nombre:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.proveedor.nombre }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Tipo:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.proveedor.tipo }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">Ciudad:</dt>
                <dd class="font-medium text-slate-900">{{ claimDetail()?.proveedor.ciudad }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-600">En lista restrictiva:</dt>
                <dd class="font-medium" [ngClass]="claimDetail()?.proveedor.en_lista_restrictiva ? 'text-red-600' : 'text-green-600'">
                  {{ claimDetail()?.proveedor.en_lista_restrictiva ? 'Sí' : 'No' }}
                </dd>
              </div>
            </dl>
          </app-card>
        </div>

        <!-- Explanation -->
        <app-card *ngIf="claimDetail()?.score.explicacion" title="Explicación del Score">
          <p class="text-slate-700 text-sm leading-relaxed">{{ claimDetail()?.score.explicacion }}</p>
        </app-card>

        <!-- Alerts -->
        <app-card title="Alertas Activadas" [highlighted]="(alertas() || []).length > 0">
          <div *ngIf="(alertas() || []).length > 0; else noAlerts" class="space-y-3">
            <div *ngFor="let alert of alertas()" class="border-l-4 border-amber-400 bg-amber-50 p-4 rounded">
              <div class="flex justify-between items-start mb-2">
                <p class="font-semibold text-slate-900">{{ alert.nombre_regla }}</p>
                <span class="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded">
                  +{{ alert.puntaje }} pts
                </span>
              </div>
              <p class="text-sm text-slate-700 mb-2">{{ alert.descripcion }}</p>
              <p class="text-xs text-slate-600">
                <strong>Detectado:</strong> {{ alert.valor_detectado }}
              </p>
            </div>
          </div>
          <ng-template #noAlerts>
            <p class="text-slate-600 text-center py-4">No hay alertas para este siniestro</p>
          </ng-template>
        </app-card>

        <!-- Documents -->
        <app-card title="Documentos">
          <div *ngIf="(claimDetail()?.documentos || []).length > 0; else noDocs" class="space-y-2">
            <div
              *ngFor="let doc of claimDetail()?.documentos"
              class="p-3 bg-slate-50 rounded-lg flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-slate-900">{{ doc.tipo_documento }}</p>
                <p class="text-xs text-slate-600">
                  {{ doc.entregado ? '✓ Entregado' : '✗ No entregado' }} |
                  {{ doc.legible ? '✓ Legible' : '✗ No legible' }}
                </p>
              </div>
              <span *ngIf="!doc.inconsistencia_detectada" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                OK
              </span>
              <span *ngIf="doc.inconsistencia_detectada" class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                ⚠️ Inconsistencia
              </span>
            </div>
          </div>
          <ng-template #noDocs>
            <p class="text-slate-600 text-center py-4">No hay documentos registrados</p>
          </ng-template>
        </app-card>

        <!-- Review History -->
        <app-card title="Historial de Revisión">
          <div *ngIf="(reviewHistory() || []).length > 0; else noHistory" class="space-y-4">
            <div *ngFor="let review of reviewHistory()" class="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
              <div class="flex justify-between items-start mb-2">
                <p class="font-semibold text-slate-900">{{ review.decision }}</p>
                <p class="text-xs text-slate-600">{{ review.created_at | dateFormat }}</p>
              </div>
              <p class="text-sm text-slate-700 mb-2">{{ review.comentario }}</p>
              <p class="text-xs text-slate-600"><strong>Revisado por:</strong> {{ review.reviewed_by }}</p>
            </div>
          </div>
          <ng-template #noHistory>
            <p class="text-slate-600 text-center py-4">Sin revisiones registradas</p>
          </ng-template>
        </app-card>

        <!-- Review Form -->
        <app-card title="Registrar Revisión Humana" [highlighted]="true">
          <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Decisión</label>
              <select
                formControlName="decision"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Selecciona una decisión</option>
                <option value="Aprobar">Aprobar</option>
                <option value="Rechazar">Rechazar</option>
                <option value="Escalar a antifraude">Escalar a antifraude</option>
                <option value="Solicitar información adicional">Solicitar información adicional</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Comentario</label>
              <textarea
                formControlName="comentario"
                rows="3"
                placeholder="Detalla tu decisión..."
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              [disabled]="reviewSubmitting() || !reviewForm.valid"
              class="w-full px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              {{ reviewSubmitting() ? 'Registrando...' : 'Registrar Revisión' }}
            </button>
          </form>
        </app-card>

        <!-- AI Agent Explanation -->
        <app-card title="Explicación del Agente IA">
          <div class="space-y-4">
            <p *ngIf="!agentExplanation()" class="text-slate-600 text-sm">
              Solicita al agente IA que explique por qué este siniestro fue clasificado de esta manera.
            </p>
            <div *ngIf="agentExplanation()" class="bg-blue-50 p-4 rounded-lg">
              <p class="text-slate-700 text-sm leading-relaxed">{{ agentExplanation() }}</p>
            </div>
            <button
              (click)="onRequestAgentExplanation()"
              [disabled]="gettingAgentExplanation()"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {{ gettingAgentExplanation() ? '🤖 Consultando...' : '🤖 Pedir Explicación' }}
            </button>
          </div>
        </app-card>

        <!-- Action Buttons -->
        <div class="flex gap-3 flex-wrap">
          <button
            (click)="onEvaluateClaim()"
            [disabled]="evaluatingClaim()"
            class="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
          >
            {{ evaluatingClaim() ? '⏳ Evaluando...' : '🔄 Evaluar de nuevo' }}
          </button>
          <a
            href="javascript:history.back()"
            class="px-6 py-2 bg-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-400 transition-colors"
          >
            ← Volver
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ClaimDetailPageComponent implements OnInit {
  claimDetail = signal<ClaimDetail | null>(null);
  alertas = signal<any[]>([]);
  reviewHistory = signal<ReviewHistoryItem[]>([]);
  agentExplanation = signal<string>('');

  loading = signal(false);
  evaluatingClaim = signal(false);
  reviewSubmitting = signal(false);
  gettingAgentExplanation = signal(false);

  reviewForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private claimsService: ClaimsService,
    private agentService: AgentService,
    private notificationService: NotificationService,
    fb: FormBuilder
  ) {
    this.reviewForm = fb.group({
      decision: ['', Validators.required],
      comentario: ['', Validators.required],
      reviewed_by: ['analista.demo'],
      estado_revision: ['En investigación'],
    });
  }

  ngOnInit(): void {
    const claimId = this.route.snapshot.paramMap.get('id');
    if (claimId) {
      this.loadClaimDetail(claimId);
    }
  }

  loadClaimDetail(claimId: string): void {
    this.loading.set(true);

    this.claimsService.getClaimDetail(claimId).subscribe({
      next: (detail) => {
        this.claimDetail.set(detail);
        this.loadAlertas(claimId);
        this.loadReviewHistory(claimId);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Error al cargar el detalle del siniestro');
      },
    });
  }

  loadAlertas(claimId: string): void {
    this.claimsService.getClaimAlerts(claimId).subscribe({
      next: (response) => {
        this.alertas.set(response.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadReviewHistory(claimId: string): void {
    this.claimsService.getReviewHistory(claimId).subscribe({
      next: (response) => {
        this.reviewHistory.set(response.items);
      },
      error: () => {},
    });
  }

  onEvaluateClaim(): void {
    const claimId = this.claimDetail()?.id_siniestro;
    if (!claimId) return;

    this.evaluatingClaim.set(true);
    this.claimsService.evaluateClaim(claimId).subscribe({
      next: () => {
        this.evaluatingClaim.set(false);
        this.notificationService.success('Siniestro evaluado correctamente');
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadClaimDetail(id);
      },
      error: () => {
        this.evaluatingClaim.set(false);
        this.notificationService.error('Error al evaluar el siniestro');
      },
    });
  }

  onSubmitReview(): void {
    if (!this.reviewForm.valid) return;

    const claimId = this.claimDetail()?.id_siniestro;
    if (!claimId) return;

    this.reviewSubmitting.set(true);
    const review: ReviewRequest = this.reviewForm.value;

    this.claimsService.reviewClaim(claimId, review).subscribe({
      next: () => {
        this.reviewSubmitting.set(false);
        this.notificationService.success('Revisión registrada correctamente');
        this.reviewForm.reset();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadClaimDetail(id);
      },
      error: () => {
        this.reviewSubmitting.set(false);
        this.notificationService.error('Error al registrar la revisión');
      },
    });
  }

  onRequestAgentExplanation(): void {
    const claimId = this.claimDetail()?.id_siniestro;
    if (!claimId) return;

    this.gettingAgentExplanation.set(true);
    this.agentService.explainClaim(claimId).subscribe({
      next: (response) => {
        this.agentExplanation.set(response.answer);
        this.gettingAgentExplanation.set(false);
      },
      error: () => {
        this.gettingAgentExplanation.set(false);
        this.notificationService.error('Error al obtener la explicación del agente');
      },
    });
  }
}
