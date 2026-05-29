import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { CatalogItem } from '../../../../core/mappers/catalog.mapper';
import { CatalogsService } from '../../services/catalogs.service';
import { ReviewRequest } from '../../models/review.model';

const DECISION_STATUS_MAP: Record<string, string> = {
  APPROVE: 'APPROVED',
  REJECT: 'REJECTED',
  ESCALATE_ANTIFRAUD: 'ESCALATED_ANTIFRAUD',
  REQUEST_DOCUMENTS: 'PENDING_DOCUMENTS',
  KEEP_IN_REVIEW: 'IN_REVIEW',
};

@Component({
  selector: 'app-claim-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent, AppCardComponent],
  template: `
    <app-card title="Revisión humana" eyebrow="Decisión del supervisor" [highlighted]="true">
      <form class="review-form" [formGroup]="form" (ngSubmit)="submit()">
        <label class="field">
          <span>Decisión</span>
          <select formControlName="decision">
            <option value="">Selecciona una decisión</option>
            <option *ngFor="let item of decisions()" [value]="item.code">{{ item.name }}</option>
          </select>
        </label>

        <label class="field">
          <span>Estado resultante</span>
          <select formControlName="estadoResultante">
            <option value="">Selecciona un estado</option>
            <option *ngFor="let item of statuses()" [value]="item.code">{{ item.name }}</option>
          </select>
        </label>

        <label class="field field--full">
          <span>Comentario</span>
          <textarea
            rows="4"
            formControlName="comentario"
            maxlength="2000"
            placeholder="Describe la recomendación o hallazgo para revisión humana..."
          ></textarea>
        </label>

        <small class="muted-text">La decisión final debe ser validada por una persona analista.</small>
        <app-button label="Registrar revisión" type="submit" [disabled]="form.invalid || loading()"></app-button>
      </form>
    </app-card>
  `,
})
export class ClaimReviewFormComponent implements OnInit {
  @Output() reviewSubmitted = new EventEmitter<ReviewRequest>();

  decisions = signal<CatalogItem[]>([]);
  statuses = signal<CatalogItem[]>([]);
  loading = signal(true);

  form = this.formBuilder.nonNullable.group({
    decision: ['', Validators.required],
    estadoResultante: ['', Validators.required],
    comentario: ['', [Validators.maxLength(2000)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private catalogsService: CatalogsService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.catalogsService.getDecisions(), this.catalogsService.getClaimStatuses()]).subscribe({
      next: ([decisions, statuses]) => {
        this.decisions.set(decisions);
        this.statuses.set(statuses);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.form.controls.decision.valueChanges.subscribe((decisionCode) => {
      const suggestedStatus = DECISION_STATUS_MAP[decisionCode];
      const currentStatus = this.form.controls.estadoResultante.value;

      if (!suggestedStatus || currentStatus) {
        return;
      }

      const statusExists = this.statuses().some((item) => item.code === suggestedStatus);
      if (statusExists) {
        this.form.patchValue({ estadoResultante: suggestedStatus }, { emitEvent: false });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.reviewSubmitted.emit({
      decision: value.decision,
      estadoResultante: value.estadoResultante,
      comentario: value.comentario || null,
    });

    this.form.patchValue({ comentario: '' });
  }
}
