import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppButtonComponent } from '../button/app-button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule, AppButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-center">
        <p class="text-6xl mb-4">{{ icon }}</p>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">{{ title }}</h3>
        <p class="text-slate-600 mb-6 max-w-md">{{ message }}</p>
        <app-button
          *ngIf="actionLabel"
          [label]="actionLabel"
          [click]="onAction"
        ></app-button>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon: string = '📭';
  @Input() title: string = 'Sin resultados';
  @Input() message: string = 'No hay información disponible.';
  @Input() actionLabel?: string;
  @Input() onAction: (() => void) | null = null;
}
