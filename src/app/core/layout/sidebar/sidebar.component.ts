import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';

interface NavItem {
  label: string;
  route: string;
  shortcut: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar__brand">
        <div class="brand-mark" aria-hidden="true">AI</div>
        <div>
          <h1>Fraudia AI</h1>
          <p>Riesgo de siniestros</p>
        </div>
      </div>

      <nav class="sidebar__nav" aria-label="Navegación principal">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          class="sidebar-link"
          (click)="onNavigate()"
        >
          <span class="sidebar-link__icon" aria-hidden="true">{{ item.shortcut }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar__footer">
        <span>Demo MVP</span>
        <strong>v1.0.0</strong>
      </div>
    </div>
  `,
})
export class SidebarComponent {
  @Output() navigate = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: APP_ROUTES.dashboard, shortcut: 'D' },
    { label: 'Cargar dataset', route: APP_ROUTES.uploads, shortcut: 'U' },
    { label: 'Siniestros', route: APP_ROUTES.claims, shortcut: 'S' },
    { label: 'Reglas', route: APP_ROUTES.rules, shortcut: 'R' },
    { label: 'Agente IA', route: APP_ROUTES.agent, shortcut: 'IA' },
    { label: 'Reportes', route: APP_ROUTES.reports, shortcut: 'P' },
  ];

  onNavigate(): void {
    this.navigate.emit();
  }
}
