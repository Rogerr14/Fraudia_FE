import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getRiskBadgeClasses()">
      {{ label }}
    </span>
  `,
})
export class RiskBadgeComponent {
  @Input() level: 'Verde' | 'Amarillo' | 'Rojo' = 'Verde';
  @Input() compact: boolean = false;

  get label(): string {
    return this.level;
  }

  getRiskBadgeClasses(): string {
    const baseClasses = this.compact
      ? 'inline-block px-2 py-1 rounded text-xs font-bold'
      : 'inline-block px-4 py-2 rounded-lg text-sm font-semibold';

    const levelClasses = {
      Verde: 'bg-green-100 text-green-800',
      Amarillo: 'bg-amber-100 text-amber-800',
      Rojo: 'bg-red-100 text-red-800',
    };

    return `${baseClasses} ${levelClasses[this.level]}`;
  }
}
