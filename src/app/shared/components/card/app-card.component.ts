import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="getCardClasses()">
      <div *ngIf="title" class="border-b border-slate-200 pb-4 mb-4">
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class AppCardComponent {
  @Input() title?: string;
  @Input() highlighted: boolean = false;
  @Input() noPadding: boolean = false;

  getCardClasses(): string {
    const baseClasses = 'bg-white rounded-lg border border-slate-200 shadow-sm';
    const paddingClasses = this.noPadding ? '' : 'p-6';
    const highlightClasses = this.highlighted ? 'border-blue-300 bg-blue-50' : '';

    return `${baseClasses} ${paddingClasses} ${highlightClasses}`;
  }
}
