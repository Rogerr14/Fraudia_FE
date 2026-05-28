import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { RiskBadgeComponent } from '../../../../shared/components/risk-badge/risk-badge.component';
import { ReportsService } from '../../services/reports.service';
import { CriticalCase, ExecutiveSummary } from '../../../../core/models/report.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormatPipe,
    RiskBadgeComponent,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Reportes</h1>
        <p class="text-slate-600">Análisis ejecutivo de casos críticos y recomendaciones</p>
      </div>

      <!-- Executive Summary Section -->
      <app-card title="Resumen Ejecutivo">
        <div class="space-y-6">
          <div *ngIf="loadingSummary()" class="py-8">
            <app-loading-spinner message="Generando resumen..."></app-loading-spinner>
          </div>

          <div *ngIf="!loadingSummary() && executiveSummary()" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-slate-700">
                {{ executiveSummary()?.resumen }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-slate-50 rounded-lg p-4 text-center">
                <p class="text-sm text-slate-600 mb-1">Total Siniestros</p>
                <p class="text-2xl font-bold text-slate-900">
                  {{ executiveSummary()?.metricas.total_siniestros }}
                </p>
              </div>
              <div class="bg-red-50 rounded-lg p-4 text-center">
                <p class="text-sm text-red-700 mb-1">Casos Rojos</p>
                <p class="text-2xl font-bold text-red-600">
                  {{ executiveSummary()?.metricas.casos_rojos }}
                </p>
              </div>
              <div class="bg-amber-50 rounded-lg p-4 text-center">
                <p class="text-sm text-amber-700 mb-1">Casos Amarillos</p>
                <p class="text-2xl font-bold text-amber-600">
                  {{ executiveSummary()?.metricas.casos_amarillos }}
                </p>
              </div>
              <div class="bg-red-50 rounded-lg p-4 text-center">
                <p class="text-sm text-red-700 mb-1">Monto en Riesgo</p>
                <p class="text-xl font-bold text-red-600">
                  {{ executiveSummary()?.metricas.monto_en_riesgo | currencyFormat }}
                </p>
              </div>
            </div>

            <div *ngIf="executiveSummary()?.recomendaciones && executiveSummary()?.recomendaciones.length > 0">
              <h4 class="font-bold text-slate-900 mb-3">Recomendaciones:</h4>
              <ul class="space-y-2">
                <li *ngFor="let rec of executiveSummary()?.recomendaciones" class="flex gap-2">
                  <span class="text-blue-600">•</span>
                  <span class="text-slate-700">{{ rec }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div *ngIf="!loadingSummary() && !executiveSummary()" class="text-center py-8">
            <p class="text-slate-600 mb-4">Genera un resumen ejecutivo del periodo</p>
            <button
              (click)="onGenerateExecutiveSummary()"
              [disabled]="loadingSummary()"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              Generar Resumen Ejecutivo
            </button>
          </div>
        </div>
      </app-card>

      <!-- Critical Cases Section -->
      <app-card title="Casos Críticos">
        <div class="space-y-4">
          <div *ngIf="loadingCritical()" class="py-8">
            <app-loading-spinner message="Cargando casos críticos..."></app-loading-spinner>
          </div>

          <div *ngIf="!loadingCritical() && criticalCases().length > 0" class="space-y-4">
            <div
              *ngFor="let case of criticalCases()"
              class="border-l-4 border-red-400 bg-red-50 p-4 rounded-lg"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p class="font-bold text-slate-900">{{ case.id_siniestro }}</p>
                  <p class="text-sm text-slate-600">Score: {{ case.score_final }}</p>
                </div>
                <app-risk-badge [level]="case.nivel_riesgo" [compact]="true"></app-risk-badge>
              </div>

              <div class="mb-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p class="text-slate-600">Monto Reclamado</p>
                  <p class="font-medium text-slate-900">{{ case.monto_reclamado | currencyFormat }}</p>
                </div>
              </div>

              <div class="mb-3">
                <p class="text-sm font-medium text-slate-700 mb-2">Motivos de Alerta:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let motivo of case.principales_motivos"
                    class="text-xs bg-red-200 text-red-900 px-2 py-1 rounded"
                  >
                    {{ motivo }}
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <p class="text-sm font-medium text-slate-700 mb-2">Recomendación:</p>
                <p class="text-sm text-slate-700 bg-white p-2 rounded">{{ case.recomendacion }}</p>
              </div>
            </div>
          </div>

          <div *ngIf="!loadingCritical() && criticalCases().length === 0" class="text-center py-8">
            <p class="text-slate-600 mb-4">Sin casos críticos en este periodo</p>
            <button
              (click)="onLoadCriticalCases()"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cargar Casos Críticos
            </button>
          </div>
        </div>
      </app-card>

      <!-- Export Options -->
      <app-card title="Opciones de Descarga">
        <div class="space-y-3">
          <p class="text-sm text-slate-600">
            Prepara los reportes para exportación o descarga futura
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              (click)="onDownloadJSON()"
              class="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              📥 Descargar como JSON
            </button>
            <button
              (click)="onDownloadCSV()"
              class="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              📥 Descargar como CSV
            </button>
            <button
              (click)="onPrint()"
              class="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </app-card>
    </div>
  `,
})
export class ReportsPageComponent implements OnInit {
  loadingSummary = signal(false);
  loadingCritical = signal(false);
  executiveSummary = signal<ExecutiveSummary | null>(null);
  criticalCases = signal<CriticalCase[]>([]);

  constructor(
    private reportsService: ReportsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.onLoadCriticalCases();
  }

  onLoadCriticalCases(): void {
    this.loadingCritical.set(true);

    this.reportsService.getCriticalCases(20).subscribe({
      next: (response) => {
        this.criticalCases.set(response.items);
        this.loadingCritical.set(false);
      },
      error: () => {
        this.loadingCritical.set(false);
        this.notificationService.error('Error al cargar los casos críticos');
      },
    });
  }

  onGenerateExecutiveSummary(): void {
    this.loadingSummary.set(true);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const fechaDesde = startOfYear.toISOString().split('T')[0];
    const fechaHasta = endOfYear.toISOString().split('T')[0];

    this.reportsService.getExecutiveSummary(fechaDesde, fechaHasta, true).subscribe({
      next: (response) => {
        this.executiveSummary.set(response);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.loadingSummary.set(false);
        this.notificationService.error('Error al generar el resumen ejecutivo');
      },
    });
  }

  onDownloadJSON(): void {
    const data = {
      executiveSummary: this.executiveSummary(),
      criticalCases: this.criticalCases(),
      generatedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, 'reportes.json', 'application/json');
  }

  onDownloadCSV(): void {
    let csv = 'ID Siniestro,Score,Riesgo,Monto,Motivos\n';

    this.criticalCases().forEach((c) => {
      csv += `"${c.id_siniestro}","${c.score_final}","${c.nivel_riesgo}","${c.monto_reclamado}","${c.principales_motivos.join('; ')}"\n`;
    });

    this.downloadFile(csv, 'casos-criticos.csv', 'text/csv');
  }

  onPrint(): void {
    window.print();
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    this.notificationService.success('Archivo descargado correctamente');
  }
}
