import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';

interface MobileNavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-t border-slate-200 px-2 py-2 flex justify-around">
      <a
        *ngFor="let item of navItems"
        [routerLink]="item.route"
        routerLinkActive="text-blue-600"
        class="flex flex-col items-center gap-1 px-2 py-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span class="text-xs">{{ item.label }}</span>
      </a>
    </nav>
  `,
})
export class MobileNavComponent {
  navItems: MobileNavItem[] = [
    { label: 'Dashboard', route: APP_ROUTES.dashboard, icon: '📊' },
    { label: 'Cargar', route: APP_ROUTES.uploads, icon: '📁' },
    { label: 'Siniestros', route: APP_ROUTES.claims, icon: '📋' },
    { label: 'Reglas', route: APP_ROUTES.rules, icon: '⚙️' },
    { label: 'Reportes', route: APP_ROUTES.reports, icon: '📈' },
  ];
}
