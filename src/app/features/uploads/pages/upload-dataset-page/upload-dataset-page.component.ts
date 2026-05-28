import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { UploadService } from '../../services/upload.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UploadDatasetResponse } from '../../../../core/models/upload.model';
import { ScoringService } from '../../../claims/services/scoring.service';

@Component({
  selector: 'app-upload-dataset-page',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AppButtonComponent,
    FileUploadComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Cargar Dataset</h1>
        <p class="text-slate-600">Sube un archivo CSV, XLSX o JSON con los datos de siniestros</p>
      </div>

      <!-- Upload Section -->
      <app-card title="Seleccionar Archivo">
        <div class="space-y-6">
          <app-file-upload
            acceptedFormats=".csv,.xlsx,.json"
            (fileSelected)="onFileSelected($event)"
            (fileCleared)="onFileCleared()"
          ></app-file-upload>

          <button
            class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            (click)="onUpload()"
            [disabled]="!selectedFile() || uploading()"
          >
            <span *ngIf="!uploading()">📤 Cargar Dataset</span>
            <span *ngIf="uploading()" class="flex items-center justify-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
              Cargando...
            </span>
          </button>
        </div>
      </app-card>

      <!-- Upload Result -->
      <app-card *ngIf="uploadResult()" title="Resumen de Carga">
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-900">
              <strong>Batch ID:</strong> {{ uploadResult()?.batch_id }}
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-50 rounded-lg p-4 text-center">
              <p class="text-sm text-slate-600 mb-1">Total Filas</p>
              <p class="text-2xl font-bold text-slate-900">{{ uploadResult()?.summary.total_rows }}</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <p class="text-sm text-green-700 mb-1">Válidas</p>
              <p class="text-2xl font-bold text-green-600">{{ uploadResult()?.summary.valid_rows }}</p>
            </div>
            <div class="bg-red-50 rounded-lg p-4 text-center">
              <p class="text-sm text-red-700 mb-1">Inválidas</p>
              <p class="text-2xl font-bold text-red-600">{{ uploadResult()?.summary.invalid_rows }}</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <p class="text-sm text-blue-700 mb-1">% Éxito</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ getSuccessPercentage() }}%
              </p>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <p><strong>Siniestros creados:</strong> {{ uploadResult()?.summary.created_siniestros }}</p>
            <p><strong>Pólizas creadas:</strong> {{ uploadResult()?.summary.created_polizas }}</p>
            <p><strong>Asegurados creados:</strong> {{ uploadResult()?.summary.created_asegurados }}</p>
            <p><strong>Proveedores creados:</strong> {{ uploadResult()?.summary.created_proveedores }}</p>
            <p><strong>Documentos creados:</strong> {{ uploadResult()?.summary.created_documentos }}</p>
          </div>

          <!-- Errors Section -->
          <div *ngIf="uploadResult()?.errors && uploadResult()?.errors.length > 0" class="mt-6">
            <h3 class="font-semibold text-slate-900 mb-3">Errores detectados:</h3>
            <div class="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
              <div class="max-h-48 overflow-y-auto">
                <table class="w-full text-sm">
                  <thead class="bg-red-100 border-b border-red-200">
                    <tr>
                      <th class="text-left px-3 py-2">Fila</th>
                      <th class="text-left px-3 py-2">Campo</th>
                      <th class="text-left px-3 py-2">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let error of uploadResult()?.errors" class="border-b border-red-100 hover:bg-red-100">
                      <td class="px-3 py-2 text-red-900">{{ error.row }}</td>
                      <td class="px-3 py-2 text-red-900">{{ error.field }}</td>
                      <td class="px-3 py-2 text-red-900">{{ error.message }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Batch Evaluation Button -->
          <button
            *ngIf="uploadResult()?.batch_id"
            class="w-full mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            (click)="onEvaluateBatch()"
            [disabled]="evaluatingBatch()"
          >
            <span *ngIf="!evaluatingBatch()">🔄 Evaluar Batch Completo</span>
            <span *ngIf="evaluatingBatch()" class="flex items-center justify-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
              Evaluando...
            </span>
          </button>
        </div>
      </app-card>
    </div>
  `,
})
export class UploadDatasetPageComponent {
  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  evaluatingBatch = signal(false);
  uploadResult = signal<UploadDatasetResponse | null>(null);

  constructor(
    private uploadService: UploadService,
    private scoringService: ScoringService,
    private notificationService: NotificationService
  ) {}

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  onFileCleared(): void {
    this.selectedFile.set(null);
    this.uploadResult.set(null);
  }

  onUpload(): void {
    if (!this.selectedFile()) return;

    this.uploading.set(true);
    this.uploadService.uploadDataset(this.selectedFile()!, 'full').subscribe({
      next: (response) => {
        this.uploadResult.set(response);
        this.uploading.set(false);
        this.notificationService.success('Dataset cargado correctamente');
      },
      error: () => {
        this.uploading.set(false);
        this.notificationService.error('Error al cargar el dataset');
      },
    });
  }

  onEvaluateBatch(): void {
    if (!this.uploadResult()?.batch_id) return;

    const batchId = this.uploadResult()!.batch_id;
    const claimIds = this.uploadResult()!.summary.created_siniestros;

    // Generate mock claim IDs for batch evaluation
    const mockClaimIds = Array.from({ length: claimIds }, (_, i) => `SIN-${String(i + 1).padStart(3, '0')}`);

    this.evaluatingBatch.set(true);
    this.scoringService.evaluateBatch({
      id_siniestros: mockClaimIds.slice(0, 10), // Evaluate first 10
      include_ai_model: true,
      include_nlp: true,
    }).subscribe({
      next: (response) => {
        this.evaluatingBatch.set(false);
        this.notificationService.success(`Evaluación completada: ${response.summary.processed} siniestros procesados`);
      },
      error: () => {
        this.evaluatingBatch.set(false);
        this.notificationService.error('Error al evaluar el batch');
      },
    });
  }

  getSuccessPercentage(): number {
    if (!this.uploadResult()) return 0;
    const total = this.uploadResult()!.summary.total_rows;
    if (total === 0) return 0;
    return Math.round((this.uploadResult()!.summary.valid_rows / total) * 100);
  }
}
