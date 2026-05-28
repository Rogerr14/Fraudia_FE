import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="px-6 py-8 border-b border-slate-700">
        <h1 class="text-2xl font-bold">🔍 Fraude AI</h1>
        <p class="text-xs text-slate-400 mt-1">Detector de Siniestros</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="bg-blue-600"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-slate-800 transition-colors"
          (click)="onNavigate()"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
        <p>v1.0.0</p>
        <p class="mt-2">© 2026 Fraud Detection</p>
      </div>
    </div>
  `,
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: APP_ROUTES.dashboard, icon: '📊' },
    { label: 'Cargar Dataset', route: APP_ROUTES.uploads, icon: '📁' },
    { label: 'Siniestros', route: APP_ROUTES.claims, icon: '📋' },
    { label: 'Reglas', route: APP_ROUTES.rules, icon: '⚙️' },
    { label: 'Agente IA', route: APP_ROUTES.agent, icon: '🤖' },
    { label: 'Reportes', route: APP_ROUTES.reports, icon: '📈' },
  ];

  onNavigate(): void {
    this.navigate.emit();
  }
}
