import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonType = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="getButtonClasses()"
      (click)="onClick()"
    >
      <span *ngIf="!loading">{{ label }}</span>
      <span *ngIf="loading" class="flex items-center gap-2">
        <span class="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
        {{ loadingLabel }}
      </span>
    </button>
  `,
})
export class AppButtonComponent {
  @Input() label: string = 'Click';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonType = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingLabel: string = 'Procesando...';
  @Input() click: (() => void) | null = null;

  onClick(): void {
    if (this.click) {
      this.click();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'font-medium rounded-lg transition-colors duration-200 inline-flex items-center justify-center gap-2';
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
      secondary: 'bg-slate-300 text-slate-900 hover:bg-slate-400 disabled:bg-slate-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
      success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }
}
