import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button (click)="onToggleSidebar()" class="md:hidden text-slate-600 hover:text-slate-900">
          ☰
        </button>
        <h2 class="text-lg font-semibold text-slate-900">Detector de Fraudes en Siniestros</h2>
      </div>

      <!-- User Info -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-slate-600 hidden sm:block">Usuario: Analista Demo</span>
        <button class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          AD
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
