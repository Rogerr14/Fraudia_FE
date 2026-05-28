import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p *ngIf="message" class="mt-4 text-slate-600">{{ message }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
}
