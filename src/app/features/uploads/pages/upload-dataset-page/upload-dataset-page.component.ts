import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ScoringService } from '../../../claims/services/scoring.service';
import { UploadService } from '../../services/upload.service';
import { UploadDatasetResponse } from '../../models/upload.model';
import { UploadSummaryComponent } from '../../components/upload-summary/upload-summary.component';
import { UploadErrorsComponent } from '../../components/upload-errors/upload-errors.component';

@Component({
  selector: 'app-upload-dataset-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppButtonComponent,
    AppCardComponent,
    FileUploadComponent,
    LoadingSpinnerComponent,
    UploadSummaryComponent,
    UploadErrorsComponent,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="page-kicker">Ingesta de datos</p>
          <h1>Cargar dataset</h1>
          <span>Importa archivos CSV, XLSX o JSON para activar el análisis de riesgo.</span>
        </div>
      </header>

      <app-card title="Seleccionar archivo" eyebrow="Carga segura">
        <div class="form-grid form-grid--upload">
          <label class="field">
            <span>Dataset</span>
            <select [(ngModel)]="datasetType">
              <option value="auto">Detectar automáticamente</option>
              <option value="siniestros">Siniestros</option>
              <option value="polizas">Pólizas</option>
              <option value="asegurados">Asegurados</option>
              <option value="proveedores">Proveedores</option>
              <option value="vehiculos">Vehículos</option>
              <option value="documentos">Documentos</option>
            </select>
          </label>
          <app-file-upload (fileSelected)="onFileSelected($event)" (fileCleared)="onFileCleared()"></app-file-upload>
        </div>

        <div class="actions-row">
          <app-button
            label="Cargar dataset"
            loadingLabel="Cargando..."
            [disabled]="!selectedFile()"
            [loading]="uploading()"
            (pressed)="uploadDataset()"
          ></app-button>
        </div>
      </app-card>

      <app-loading-spinner *ngIf="uploading()" message="Enviando archivo al backend..."></app-loading-spinner>

      <app-card *ngIf="uploadResult() as result" title="Resumen de carga" eyebrow="Resultado del procesamiento">
        <app-upload-summary [result]="result"></app-upload-summary>
        <app-upload-errors [errors]="result.errors"></app-upload-errors>
        <div class="actions-row">
          <app-button
            label="Ejecutar evaluación batch"
            variant="success"
            [loading]="evaluatingBatch()"
            loadingLabel="Evaluando..."
            (pressed)="runBatchAssessment(result)"
          ></app-button>
        </div>
      </app-card>
    </section>
  `,
})
export class UploadDatasetPageComponent {
  selectedFile = signal<File | null>(null);
  uploadResult = signal<UploadDatasetResponse | null>(null);
  uploading = signal(false);
  evaluatingBatch = signal(false);
  datasetType = 'auto';

  constructor(
    private uploadService: UploadService,
    private scoringService: ScoringService,
    private notificationService: NotificationService
  ) {}

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
    this.uploadResult.set(null);
  }

  onFileCleared(): void {
    this.selectedFile.set(null);
    this.uploadResult.set(null);
  }

  uploadDataset(): void {
    const file = this.selectedFile();
    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.uploadService.uploadDataset(file, this.datasetType).subscribe({
      next: (result) => {
        this.uploadResult.set(result);
        this.uploading.set(false);
        this.notificationService.success('Dataset cargado correctamente.');
      },
      error: () => {
        this.uploading.set(false);
      },
    });
  }

  runBatchAssessment(result: UploadDatasetResponse): void {
    this.evaluatingBatch.set(true);
    this.scoringService.confirmImportedDatasetAssessment(result.createdAssessments).subscribe({
      next: (response) => {
        this.evaluatingBatch.set(false);
        this.notificationService.success(response.message);
      },
      error: () => {
        this.evaluatingBatch.set(false);
      },
    });
  }
}
