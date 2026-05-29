import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDatasetResponse } from '../../models/upload.model';

@Component({
  selector: 'app-upload-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="upload-summary">
      <div class="upload-summary__header">
        <span>Archivo procesado</span>
        <strong>{{ result.fileName }}</strong>
        <p>{{ result.message }}</p>
        <small>Estado: {{ result.status }}</small>
      </div>

      <div class="metric-grid metric-grid--compact">
        <article class="metric-card">
          <span>Total</span>
          <strong>{{ result.totalRows }}</strong>
        </article>
        <article class="metric-card metric-card--blue">
          <span>Válidas</span>
          <strong>{{ result.validRows }}</strong>
        </article>
        <article class="metric-card metric-card--red">
          <span>Inválidas</span>
          <strong>{{ result.invalidRows }}</strong>
        </article>
        <article class="metric-card metric-card--green">
          <span>Evaluaciones</span>
          <strong>{{ result.createdAssessments }}</strong>
        </article>
      </div>

      <div class="metric-grid metric-grid--compact">
        <article class="metric-card metric-card--green">
          <span>Verdes</span>
          <strong>{{ result.greenCount }}</strong>
        </article>
        <article class="metric-card metric-card--yellow">
          <span>Amarillas</span>
          <strong>{{ result.yellowCount }}</strong>
        </article>
        <article class="metric-card metric-card--red">
          <span>Rojas</span>
          <strong>{{ result.redCount }}</strong>
        </article>
      </div>

      <div class="dataset-grid">
        <div><span>Asegurados</span><strong>{{ result.createdInsureds }}</strong></div>
        <div><span>Pólizas</span><strong>{{ result.createdPolicies }}</strong></div>
        <div><span>Vehículos</span><strong>{{ result.createdVehicles }}</strong></div>
        <div><span>Proveedores</span><strong>{{ result.createdProviders }}</strong></div>
        <div><span>Siniestros</span><strong>{{ result.createdClaims }}</strong></div>
        <div><span>Documentos</span><strong>{{ result.createdDocuments }}</strong></div>
      </div>
    </section>
  `,
})
export class UploadSummaryComponent {
  @Input({ required: true }) result!: UploadDatasetResponse;
}
