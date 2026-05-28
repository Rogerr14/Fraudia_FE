import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-spinner" role="status">
      <div class="loading-spinner__ring" aria-hidden="true"></div>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message = 'Cargando...';
}
