import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getBadgeClasses()">
      {{ label }}
    </span>
  `,
})
export class AppBadgeComponent {
  @Input() label: string = '';
  @Input() variant: BadgeVariant = 'default';

  getBadgeClasses(): string {
    const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';

    const variantClasses = {
      default: 'bg-slate-100 text-slate-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}
